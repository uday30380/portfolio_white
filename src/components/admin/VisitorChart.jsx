import React, { useState, useEffect } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { Activity } from 'lucide-react';

const initialData = [
    { name: '00:00', visits: 45 },
    { name: '04:00', visits: 52 },
    { name: '08:00', visits: 38 },
    { name: '12:00', visits: 65 },
    { name: '16:00', visits: 48 },
    { name: '20:00', visits: 80 },
    { name: '23:59', visits: 70 },
];

const VisitorChart = () => {
    const [data, setData] = useState(initialData);

    useEffect(() => {
        const interval = setInterval(() => {
            setData(currentData => {
                const newData = [...currentData];
                // Simulate slight random fluctuations for the last data point
                const lastIndex = newData.length - 1;
                const variance = Math.floor(Math.random() * 10) - 5; // -5 to +5
                let newVisits = newData[lastIndex].visits + variance;

                // Keep within reasonable bounds
                if (newVisits < 20) newVisits = 20;
                if (newVisits > 120) newVisits = 120; // Cap at 120

                newData[lastIndex] = {
                    ...newData[lastIndex],
                    visits: newVisits
                };
                return newData;
            });
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-[#111111] rounded-[40px] border border-white/5 p-8 h-[400px] flex flex-col relative overflow-hidden group">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 z-10">
                <div>
                    <h3 className="text-lg font-black uppercase tracking-widest text-white flex items-center gap-3">
                        <Activity className="text-orange-500" size={20} /> Visitor Traffic
                    </h3>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Real-time Analytics</p>
                </div>

                {/* Live Indicator */}
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Live</span>
                </div>
            </div>

            <div className="flex-1 w-full min-h-0 z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#FF7D44" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#FF7D44" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#666', fontSize: 10, fontWeight: 900 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#666', fontSize: 10, fontWeight: 900 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#111',
                                border: '1px solid rgba(255,125,104,0.2)',
                                borderRadius: '16px',
                                fontSize: '12px',
                                fontWeight: '900',
                                color: '#fff',
                                boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)'
                            }}
                            itemStyle={{ color: '#FF7D44' }}
                            cursor={{ stroke: '#FF7D44', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="visits"
                            stroke="#FF7D44"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorVisits)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Background Glow */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-orange-500/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-orange-500/10 transition-colors duration-500"></div>
        </div>
    );
};

export default VisitorChart;
