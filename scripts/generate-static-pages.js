import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

const indexHtmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexHtmlPath)) {
    console.error('dist/index.html not found! Run vite build first.');
    process.exit(1);
}

const template = fs.readFileSync(indexHtmlPath, 'utf-8');

const pages = [
    {
        route: 'honors',
        title: 'Honors & Awards | Uday Kiran Vempati – KL University',
        description: 'Complete list of professional certifications, hackathon wins, and industry awards earned by Vempati Uday Kiran. Recognized by Canva, hackathon champion, and Amazon App Store publisher.',
        canonical: 'https://udaykiranportfolio.web.app/honors'
    },
    {
        route: 'blog',
        title: 'Blog & Articles | Vempati Uday Kiran – Tech, Design & Life',
        description: 'Read the latest blog posts by Vempati Uday Kiran on web development, Java, Firebase, design, entrepreneurship, and his B.Tech journey at KL University.',
        canonical: 'https://udaykiranportfolio.web.app/blog'
    },
    {
        route: 'resume',
        title: 'Resume | Uday Kiran Vempati',
        description: 'View and download the verified professional resume of Uday Kiran Vempati, Computer Science student (CGPA 9.52) and full-stack web developer.',
        canonical: 'https://udaykiranportfolio.web.app/resume'
    }
];

pages.forEach(({ route, title, description, canonical }) => {
    const pageDir = path.join(distDir, route);
    if (!fs.existsSync(pageDir)) {
        fs.mkdirSync(pageDir, { recursive: true });
    }

    let html = template;

    // Replace title
    html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);

    // Replace canonical
    html = html.replace(/<link rel="canonical" href=".*?"\s*\/?>/, `<link rel="canonical" href="${canonical}" />`);

    // Replace description
    html = html.replace(/<meta name="description"\s+content=".*?"\s*\/?>/, `<meta name="description" content="${description}" />`);

    // Replace og:title
    html = html.replace(/<meta property="og:title" content=".*?"\s*\/?>/, `<meta property="og:title" content="${title}" />`);

    // Replace og:description
    html = html.replace(/<meta property="og:description"\s+content=".*?"\s*\/?>/, `<meta property="og:description" content="${description}" />`);

    // Replace og:url
    html = html.replace(/<meta property="og:url" content=".*?"\s*\/?>/, `<meta property="og:url" content="${canonical}" />`);

    // Replace twitter:title
    html = html.replace(/<meta property="twitter:title" content=".*?"\s*\/?>/, `<meta property="twitter:title" content="${title}" />`);

    // Replace twitter:description
    html = html.replace(/<meta property="twitter:description"\s+content=".*?"\s*\/?>/, `<meta property="twitter:description" content="${description}" />`);

    // Replace twitter:url
    html = html.replace(/<meta property="twitter:url" content=".*?"\s*\/?>/, `<meta property="twitter:url" content="${canonical}" />`);

    fs.writeFileSync(path.join(pageDir, 'index.html'), html, 'utf-8');
    fs.writeFileSync(path.join(distDir, `${route}.html`), html, 'utf-8');
    console.log(`✅ Pre-rendered static entry for /${route} with canonical: ${canonical}`);
});
