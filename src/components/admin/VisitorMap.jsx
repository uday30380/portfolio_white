import React from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Globe } from 'lucide-react';

const VisitorMap = () => {
    // Simulated visitor data "pings"
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
        <div className="bg-[#111111] rounded-[40px] border border-white/5 p-8 relative overflow-hidden group h-full flex flex-col">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-1000"></div>

            <div className="flex justify-between items-center mb-8 relative z-10">
                <div>
                    <h3 className="text-lg font-black uppercase tracking-widest text-white flex items-center gap-3">
                        <Globe className="text-orange-500" size={20} /> Geo Signals
                    </h3>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Global Heatmap</p>
                </div>
                <div className="text-right">
                    <span className="text-3xl font-black text-white">42</span>
                    <div className="flex items-center gap-2 justify-end">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                        <span className="text-[10px] font-black text-green-500 uppercase tracking-tighter">Active</span>
                    </div>
                </div>
            </div>

            {/* Map Visualization */}
            <div className="relative w-full aspect-[2/1] bg-black/40 rounded-3xl border border-white/5 overflow-hidden flex-1">
                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,125,68,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,125,68,0.03)_1px,transparent_1px)] bg-[size:30px_30px]"></div>

                {/* Cyber Style Grid */}
                <svg viewBox="0 0 1000 500" className="w-full h-full opacity-10">
                    <circle cx="500" cy="250" r="230" fill="none" stroke="#FFFFFF" strokeWidth="0.5" />
                    <circle cx="500" cy="250" r="150" fill="none" stroke="#FFFFFF" strokeWidth="0.5" />
                    <line x1="50" y1="250" x2="950" y2="250" stroke="#FFFFFF" strokeWidth="0.5" />
                    <line x1="500" y1="20" x2="500" y2="480" stroke="#FFFFFF" strokeWidth="0.5" />
                </svg>

                {/* Visitor Pings */}
                {visitors.map((v) => (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        key={v.id}
                        className="absolute group/pin cursor-pointer"
                        style={{
                            left: `${(v.cx / 1000) * 100}%`,
                            top: `${(v.cy / 500) * 100}%`
                        }}
                    >
                        {/* Ping Animation */}
                        <div className="absolute -inset-2 bg-orange-500/20 rounded-full animate-ping"></div>
                        <div className="relative w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_15px_rgba(255,125,68,1)]"></div>

                        {/* Tooltip */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black border border-white/10 px-3 py-1.5 rounded-xl text-[8px] font-black text-white uppercase tracking-widest whitespace-nowrap opacity-0 group-hover/pin:opacity-100 transition-all transform group-hover/pin:-translate-y-1 z-20 pointer-events-none shadow-2xl">
                            {v.city} // {v.country}
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4 relative z-10">
                {[
                    { label: "Top Region", val: "N. America" },
                    { label: "Stability", val: "99.9%" },
                    { label: "Network", val: "Edge" }
                ].map((item, i) => (
                    <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                        <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">{item.label}</div>
                        <div className="text-white font-black text-xs uppercase tracking-tighter">{item.val}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VisitorMap;
