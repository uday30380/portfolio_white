import React from 'react';
import { Globe } from 'lucide-react';

const VisitorMap = () => {
    const visitors = [
        { id: 1, cx: 240, cy: 120, city: "New York", country: "USA" },
        { id: 2, cx: 480, cy: 110, city: "London", country: "UK" },
        { id: 3, cx: 700, cy: 150, city: "Mumbai", country: "India" },
        { id: 4, cx: 720, cy: 300, city: "Sydney", country: "Australia" },
        { id: 5, cx: 200, cy: 260, city: "Brasilia", country: "Brazil" },
        { id: 6, cx: 550, cy: 180, city: "Dubai", country: "UAE" },
        { id: 8, cx: 120, cy: 120, city: "San Francisco", country: "USA" },
        { id: 9, cx: 800, cy: 100, city: "Tokyo", country: "Japan" },
    ];

    return (
        <div className="bg-white rounded-[12px] border border-[#DDE7E5] p-6 shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-base font-semibold text-[#102A28] flex items-center gap-2">
                        <Globe className="text-[#102A28]" size={18} />
                        <span>Geo signals</span>
                    </h3>
                    <p className="text-xs text-[#8A9B98]">Global visitor map</p>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-semibold text-[#102A28]">42</span>
                    <div className="flex items-center gap-1.5 justify-end">
                        <span className="w-1.5 h-1.5 bg-[#15803D] rounded-full" />
                        <span className="text-xs text-[#15803D] font-medium">Active</span>
                    </div>
                </div>
            </div>

            {/* Map Visualization */}
            <div className="relative w-full aspect-[2/1] bg-[#F7FAFA] rounded-[8px] border border-[#DDE7E5] overflow-hidden flex-1">
                {/* Clean Grid */}
                <svg viewBox="0 0 1000 500" className="w-full h-full opacity-30">
                    <circle cx="500" cy="250" r="230" fill="none" stroke="#DDE7E5" strokeWidth="1" />
                    <circle cx="500" cy="250" r="150" fill="none" stroke="#DDE7E5" strokeWidth="1" />
                    <line x1="50" y1="250" x2="950" y2="250" stroke="#DDE7E5" strokeWidth="1" />
                    <line x1="500" y1="20" x2="500" y2="480" stroke="#DDE7E5" strokeWidth="1" />
                </svg>

                {/* Visitor Pings */}
                {visitors.map((v) => (
                    <div
                        key={v.id}
                        className="absolute group/pin cursor-pointer"
                        style={{
                            left: `${(v.cx / 1000) * 100}%`,
                            top: `${(v.cy / 500) * 100}%`
                        }}
                    >
                        <div className="relative w-2.5 h-2.5 bg-[#102A28] rounded-full border border-white shadow-sm" />

                        {/* Tooltip */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white border border-[#DDE7E5] px-2.5 py-1 rounded-[6px] text-xs font-medium text-[#102A28] whitespace-nowrap opacity-0 group-hover/pin:opacity-100 transition-opacity z-20 pointer-events-none shadow-sm">
                            {v.city}, {v.country}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VisitorMap;
