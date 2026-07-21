import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import { useData } from '../../context/DataContext';
import { Users, Folder, FileText, MessageSquare, Bell, Clock, Activity, Shield, Command, Menu } from 'lucide-react';
import { db } from '../../firebase';
import { doc, getDoc, collection, getCountFromServer } from 'firebase/firestore';
import AdminProjects from './AdminProjects';
import AdminMessages from './AdminMessages';
import AdminProfile from './AdminProfile';
import AdminSkills from './AdminSkills';
import AdminBlog from './AdminBlog';
import AdminSettings from './AdminSettings';
import VisitorChart from './VisitorChart';
import AdminFileManager from './AdminFileManager';
import VisitorMap from './VisitorMap';
import AdminTodoList from './AdminTodoList';
import AdminSocialProof from './AdminSocialProof';
import AdminResume from './AdminResume';
import AdminFooter from './AdminFooter';
import AdminHonors from './AdminHonors';

const Dashboard = () => {
    const { data } = useData();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [realStats, setRealStats] = useState({
        visitors: 0,
        messages: 0,
        isOnline: navigator.onLine
    });

    useEffect(() => {
        // Online Status
        const handleStatus = () => setRealStats(prev => ({ ...prev, isOnline: navigator.onLine }));
        window.addEventListener('online', handleStatus);
        window.addEventListener('offline', handleStatus);

        // Fetch Stats
        const fetchStats = async () => {
            // Visitor Count
            try {
                const statsRef = doc(db, 'stats', 'general');
                const statsSnap = await getDoc(statsRef);
                if (statsSnap.exists()) {
                    setRealStats(prev => ({ ...prev, visitors: statsSnap.data().totalVisitors || 0 }));
                }
            } catch (e) { console.error("Stats fetch error", e); }

            // Message count
            try {
                const messagesRef = collection(db, 'messages');
                const snapshot = await getCountFromServer(messagesRef);
                setRealStats(prev => ({ ...prev, messages: snapshot.data().count }));
            } catch (e) { console.error("Messages count error", e); }
        };

        fetchStats();

        return () => {
            window.removeEventListener('online', handleStatus);
            window.removeEventListener('offline', handleStatus);
        };
    }, []);

    const stats = [
        { label: 'Total Visits', value: realStats.visitors.toLocaleString(), icon: Activity, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        { label: 'Active Projects', value: data.projects?.length?.toString() || '0', icon: Folder, color: 'text-white', bg: 'bg-white/5' },
        { label: 'Total Posts', value: data.blog?.length?.toString() || '0', icon: FileText, color: 'text-white', bg: 'bg-white/5' },
        { label: 'Total Messages', value: realStats.messages.toString(), icon: MessageSquare, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    ];

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white font-sans lg:pl-64 transition-all duration-300 relative">

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <AdminSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <main className="p-4 lg:p-10 max-w-7xl mx-auto min-h-screen">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 lg:mb-12 gap-6">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        {/* Mobile Hamburger */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 -ml-2 text-white hover:text-orange-500 transition-colors"
                        >
                            <Menu size={28} />
                        </button>

                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-[2px] bg-orange-500"></div>
                                <span className="text-[10px] font-black tracking-[0.3em] text-orange-500 uppercase">System Overview</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-white capitalize">{activeTab === 'dashboard' ? 'Control Center' : activeTab}</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 w-full md:w-auto justify-end">
                        <a href="/" target="_blank" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-orange-500 text-gray-400 hover:text-white rounded-xl transition-all font-bold text-xs uppercase tracking-widest border border-white/5">
                            View Portfolio
                        </a>
                        <div className="hidden lg:flex items-center gap-10 border-r border-white/5 pr-10">
                            <div className="text-right">
                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Network Status</div>
                                <div className="flex items-center gap-2 justify-end">
                                    <span className={`w-2 h-2 ${realStats.isOnline ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'} rounded-full animate-pulse`}></span>
                                    <span className="text-xs font-black text-white uppercase tracking-tighter">{realStats.isOnline ? 'Online' : 'Offline'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 bg-white/5 p-2 pr-6 rounded-full border border-white/5">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1a1a1a] to-[#000000] border border-white/10 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.1)] relative overflow-hidden group hover:border-orange-500/50 transition-colors cursor-pointer">
                                <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-tr from-orange-500 to-purple-500 group-hover:text-white transition-all duration-300 z-10">
                                    U
                                </span>
                            </div>
                            <div className="hidden sm:block">
                                <div className="text-xs font-bold text-white uppercase">Uday Kiran</div>
                                <div className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Administrator</div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Overview */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-10 animate-fade-in-up">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="bg-gradient-to-br from-[#111111] to-[#050505] p-8 rounded-[32px] border border-white/5 hover:border-orange-500/30 transition-all duration-500 group relative overflow-hidden shadow-2xl hover:-translate-y-1 hover:shadow-orange-500/10">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-orange-500/10 transition-colors duration-700"></div>
                                    <div className="flex justify-between items-start mb-8 relative z-10">
                                        <div className={`p-4 rounded-2xl ${stat.bg} group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 shadow-inner`}>
                                            <stat.icon size={24} className={stat.color === 'text-white' ? 'group-hover:text-white' : stat.color} />
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] font-black text-green-500 uppercase bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full">
                                            <Activity size={12} /> +2.4%
                                        </div>
                                    </div>
                                    <h3 className="text-5xl font-black text-white mb-2 relative z-10 tracking-tight">{stat.value}</h3>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] relative z-10 group-hover:text-orange-500 transition-colors">{stat.label}</p>

                                    {/* Bottom Progress Line */}
                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
                                        <div className="h-full bg-orange-500 w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Analytics & Tools Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            {/* Main Chart - Spans 8 cols */}
                            <div className="lg:col-span-8 space-y-10">
                                <div className="bg-[#111111] rounded-[40px] border border-white/5 p-6 md:p-10">
                                    <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                                        <h3 className="text-lg font-black uppercase tracking-widest text-white flex items-center gap-3">
                                            <Activity className="text-orange-500" size={20} /> Traffic Analytics
                                        </h3>
                                        <div className="flex gap-2">
                                            <button className="px-4 py-1.5 bg-orange-500 text-[10px] font-black rounded-full uppercase tracking-widest text-white">Daily</button>
                                            <button className="px-4 py-1.5 bg-white/5 text-[10px] font-black rounded-full uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Monthly</button>
                                        </div>
                                    </div>
                                    <VisitorChart color="#FF7D44" />
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <VisitorMap />

                                    <div className="bg-[#111111] p-10 rounded-[40px] border border-white/5">
                                        <h3 className="text-lg font-black uppercase tracking-widest text-white mb-8 flex items-center gap-3">
                                            <Command className="text-orange-500" size={20} /> Terminal
                                        </h3>
                                        <div className="space-y-4">
                                            {[
                                                { label: 'New Project', icon: Folder, color: 'bg-orange-500' },
                                                { label: 'Create Post', icon: FileText, color: 'bg-white/10' },
                                                { label: 'Sync Assets', icon: Activity, color: 'bg-white/10' },
                                                { label: 'SEO Audit', icon: Shield, color: 'bg-white/10' },
                                            ].map((action, i) => (
                                                <button key={i} className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-orange-500 hover:text-white rounded-2xl transition-all duration-300 group">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center`}>
                                                            <action.icon size={16} />
                                                        </div>
                                                        <span className="font-bold text-sm">{action.label}</span>
                                                    </div>
                                                    <Activity size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar: System Health & Tasks */}
                            <div className="lg:col-span-4 space-y-10">
                                <AdminTodoList />

                                <div className="bg-[#111111] rounded-[40px] border border-white/5 p-10 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -ml-10 -mt-10"></div>
                                    <h3 className="text-lg font-black uppercase tracking-widest text-white mb-8 relative z-10 flex items-center gap-3">
                                        <Shield className="text-orange-500" size={20} /> Security
                                    </h3>
                                    <div className="space-y-8 relative z-10">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Database</span>
                                            <span className="text-xs font-black text-green-500 uppercase tracking-tighter flex items-center gap-2">
                                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                Secured
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Cloud Sync</span>
                                            <span className="text-xs font-black text-orange-500 uppercase tracking-tighter">99.9% Up</span>
                                        </div>
                                        <div className="pt-6 border-t border-white/5">
                                            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Health Score</div>
                                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                <div className="w-[98%] h-full bg-orange-500 shadow-[0_0_10px_rgba(255,125,68,0.5)]"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-orange-500 p-10 rounded-[40px] text-white relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
                                    <Clock size={40} className="mb-6 opacity-40" />
                                    <div className="text-4xl font-black mb-1">
                                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">
                                        {new Date().toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Module Rendering */}
                {activeTab === 'projects' && <AdminProjects />}
                {activeTab === 'skills' && <AdminSkills />}
                {activeTab === 'blog' && <AdminBlog />}
                {activeTab === 'messages' && <AdminMessages />}
                {activeTab === 'media' && <AdminFileManager />}
                {activeTab === 'social-proof' && <AdminSocialProof />}
                {activeTab === 'profile' && <AdminProfile />}
                {activeTab === 'resume' && <AdminResume />}
                {activeTab === 'footer' && <AdminFooter />}
                {activeTab === 'settings' && <AdminSettings />}
                {activeTab === 'honors' && <AdminHonors />}

            </main>
        </div>
    );
};

export default Dashboard;
