Add-Type -AssemblyName System.Drawing

$srcDir = "ezgif-41473dc5ad5fed8e-jpg (1)"
$outDir = "public/hero-frames-optimized"

if (!(Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

$allFiles = Get-ChildItem -Path $srcDir -Filter "*.jpg" | Sort-Object Name
$totalSrc = $allFiles.Count
Write-Host "Found $totalSrc source frames in $srcDir"

# We select 80 evenly-spaced frames from 1 to 240
$targetCount = 80
$indices = @()
for ($i = 0; $i -lt $targetCount; $i++) {
    $idx = [Math]::Round($i * ($totalSrc - 1) / ($targetCount - 1))
    $indices += $idx
}

$targetW = 540
$targetH = 960

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$encParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]85)

$destBmp = New-Object System.Drawing.Bitmap($targetW, $targetH)
$graphics = [System.Drawing.Graphics]::FromImage($destBmp)
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

$outIndex = 1
foreach ($i in $indices) {
    $srcFile = $allFiles[$i].FullName
    $srcBmp = New-Object System.Drawing.Bitmap($srcFile)
    
    $graphics.Clear([System.Drawing.Color]::Black)
    $graphics.DrawImage($srcBmp, 0, 0, $targetW, $targetH)
    
    $numStr = $outIndex.ToString("D3")
    $outPath = Join-Path $outDir "frame-$numStr.jpg"
    $destBmp.Save($outPath, $codec, $encParams)
    
    $srcBmp.Dispose()
    $outIndex++
}

$graphics.Dispose()
$destBmp.Dispose()

$totalBytes = (Get-ChildItem -Path $outDir -Filter "*.jpg" | Measure-Object -Property Length -Sum).Sum
$totalMB = [Math]::Round($totalBytes / 1MB, 2)
Write-Host "Optimized $targetCount frames generated in $outDir. Total size: $totalMB MB."
