import React, { useState, useRef, useEffect } from 'react';
import { GripVertical } from 'lucide-react';

const BeforeAfterSlider = ({ before, after }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const [containerWidth, setContainerWidth] = useState(0);
    const containerRef = useRef(null);

    const handleMove = (event) => {
        if (!isDragging && event.type !== 'click') return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;

        const position = ((clientX - containerRect.left) / containerRect.width) * 100;
        const clampedPosition = Math.min(Math.max(position, 0), 100);

        setSliderPosition(clampedPosition);
    };

    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);

    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);

        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchend', handleMouseUp);
        return () => {
            window.removeEventListener('resize', updateWidth);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchend', handleMouseUp);
        };
    }, []);

    return (
        <div className="w-full max-w-5xl mx-auto mb-20 animate-fade-in relative z-10">
            <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Project Transformation</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Drag the slider to see the visual evolution and improvements made during the development process.
                </p>
            </div>

            <div
                ref={containerRef}
                className="relative w-full aspect-video rounded-3xl overflow-hidden cursor-ew-resize select-none border border-white/10 shadow-2xl bg-[#0A0A0A]"
                onMouseMove={handleMove}
                onTouchMove={handleMove}
                onClick={handleMove}
            >
                {/* After Image (Background) */}
                <div className="absolute inset-0">
                    <img
                        src={after}
                        alt="After transformation"
                        className="w-full h-full object-cover"
                        draggable="false"
                    />
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10 pointer-events-none">
                        AFTER
                    </div>
                </div>

                {/* Before Image (Clipped) */}
                <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${sliderPosition}%` }}
                >
                    <img
                        src={before}
                        alt="Before transformation"
                        className="w-full h-full object-cover max-w-none"
                        style={{ width: `${containerWidth}px` }}
                        draggable="false"
                    />
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10 pointer-events-none">
                        BEFORE
                    </div>
                </div>

                {/* Slider Handle */}
                <div
                    className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_20px_rgba(255,255,255,0.5)] z-20"
                    style={{ left: `${sliderPosition}%` }}
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleMouseDown}
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-black transition-transform hover:scale-110 active:scale-95">
                        <GripVertical size={20} />
                    </div>
                </div>

                {/* Overlay Gradient for depth */}
                <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] pointer-events-none rounded-3xl"></div>
            </div>
        </div>
    );
};

export default BeforeAfterSlider;
