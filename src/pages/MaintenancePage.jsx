import { useData } from '../context/DataContext';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Settings } from 'lucide-react';


const MaintenancePage = () => {
    const { data } = useData();
    const message = data?.settings?.maintenanceMessage || "Deploying Fixes";
    const time = data?.settings?.maintenanceTime || "Shortly";

    return (
        <div className="min-h-screen bg-[#030303] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-orange-500/30">

            {/* 1. Cinematic Background Grid */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]"></div>

                {/* Glowing Ambience */}
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] animate-pulse delay-700"></div>
            </div>

            {/* 2. Main "System Card" Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-4xl"
            >
                <div className="backdrop-blur-3xl bg-white/[0.02] border border-white/10 rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden group">

                    {/* Animated Border Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[2s] ease-in-out"></div>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">

                        {/* Left: Text Content */}
                        <div className="space-y-8 text-center lg:text-left">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-bold uppercase tracking-[0.2em]"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping"></div>
                                System Maintenance Mode
                            </motion.div>

                            <div className="space-y-4">
                                <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">
                                    UPGRADING <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-white">PROTOCOL.</span>
                                </h1>
                                <p className="text-gray-400 text-lg leading-relaxed max-w-md mx-auto lg:mx-0">
                                    We are executing a planned infrastructure enhancement to elevate performance and security.
                                </p>
                            </div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
                            >
                                <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-xl border border-white/5 min-w-[180px]">
                                    <Activity size={18} className="text-orange-500" />
                                    <div className="text-left">
                                        <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Status</div>
                                        <div className="text-xs font-bold text-white">{message}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-xl border border-white/5 min-w-[180px]">
                                    <ShieldCheck size={18} className="text-orange-500" />
                                    <div className="text-left">
                                        <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Security</div>
                                        <div className="text-xs font-bold text-white">Optimizing...</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right: Visual Element */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="relative flex items-center justify-center order-first lg:order-none mb-10 lg:mb-0"
                        >
                            <div className="relative w-64 h-64">
                                {/* Rotating Rings */}
                                <div className="absolute inset-0 border border-orange-500/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
                                <div className="absolute inset-4 border border-white/10 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-500/20 to-transparent blur-3xl animate-pulse"></div>

                                {/* Center Icon */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-24 h-24 bg-[#0a0a0a] rounded-2xl border border-orange-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.2)]">
                                        <Settings size={40} className="text-white animate-[spin_4s_linear_infinite]" />
                                    </div>
                                </div>

                                {/* Orbiting Dot */}
                                <div className="absolute inset-0 animate-[spin_8s_linear_infinite]">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-orange-500 rounded-full shadow-[0_0_15px_rgba(249,115,22,1)]"></div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Bottom Progress */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4"
                    >
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">
                            Estimated Completion: {time}
                        </p>
                        <div className="flex gap-2">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="w-2 h-2 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: `${i * 0.2} s` }}></div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Footer */}
            <footer className="absolute bottom-8 left-0 w-full text-center z-10">
                <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em] hover:text-orange-500/50 transition-colors cursor-default">
                    Vempati Uday Kiran • {new Date().getFullYear()}
                </p>
            </footer>

        </div>
    );
};

export default MaintenancePage;
