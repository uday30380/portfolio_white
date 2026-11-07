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
                const lastIndex = newData.length - 1;
                const variance = Math.floor(Math.random() * 10) - 5;
                let newVisits = newData[lastIndex].visits + variance;

                if (newVisits < 20) newVisits = 20;
                if (newVisits > 120) newVisits = 120;

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
        <div className="bg-white rounded-[12px] border border-[#DDE7E5] p-6 h-[380px] flex flex-col shadow-sm">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-base font-semibold text-[#102A28] flex items-center gap-2">
                        <Activity className="text-[#102A28]" size={18} />
                        <span>Visitor traffic</span>
                    </h3>
                    <p className="text-xs text-[#8A9B98]">Real-time analytics</p>
                </div>

                {/* Live Indicator */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EEF4F3] border border-[#DDE7E5]">
                    <span className="w-2 h-2 rounded-full bg-[#15803D]" />
                    <span className="text-xs font-medium text-[#15803D]">Live</span>
                </div>
            </div>

            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0F766E" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#0F766E" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DDE7E5" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#8A9B98', fontSize: 11 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#8A9B98', fontSize: 11 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #DDE7E5',
                                borderRadius: '8px',
                                color: '#102A28',
                                fontSize: '12px'
                            }}
                            itemStyle={{ color: '#102A28' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="visits"
                            stroke="#0F766E"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorVisits)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default VisitorChart;
