import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import { useData } from '../../context/DataContext';
import { Folder, FileText, MessageSquare, Activity, Shield, Command, Menu } from 'lucide-react';
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
import AdminBtechJourney from './AdminBtechJourney';

const Dashboard = () => {
    const { data } = useData();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [realStats, setRealStats] = useState({
        visitors: 0,
        messages: 0,
        isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true
    });

    useEffect(() => {
        const handleStatus = () => setRealStats(prev => ({ ...prev, isOnline: navigator.onLine }));
        window.addEventListener('online', handleStatus);
        window.addEventListener('offline', handleStatus);

        const fetchStats = async () => {
            try {
                const statsRef = doc(db, 'stats', 'general');
                const statsSnap = await getDoc(statsRef);
                if (statsSnap.exists()) {
                    setRealStats(prev => ({ ...prev, visitors: statsSnap.data().totalVisitors || 0 }));
                }
            } catch (e) { console.error("Stats fetch error", e); }

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
        { label: 'Total Visits', value: realStats.visitors.toLocaleString(), icon: Activity },
        { label: 'Active Projects', value: data?.projects?.length?.toString() || '0', icon: Folder },
        { label: 'Total Posts', value: data?.blog?.length?.toString() || '0', icon: FileText },
        { label: 'Total Messages', value: realStats.messages.toString(), icon: MessageSquare },
    ];

    return (
        <div className="min-h-screen bg-[#F7FAFA] text-[#102A28] font-sans lg:pl-64 transition-all duration-300 relative">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <AdminSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <main className="p-4 lg:p-8 max-w-7xl mx-auto min-h-screen">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 pb-6 border-b border-[#DDE7E5]">
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button
                            type="button"
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 -ml-2 text-[#102A28] hover:bg-[#EEF4F3] rounded-lg transition-colors"
                        >
                            <Menu size={22} />
                        </button>

                        <div>
                            <span className="text-xs text-[#8A9B98] font-medium block">Admin Control</span>
                            <h1 className="text-2xl md:text-3xl font-semibold text-[#102A28] capitalize">
                                {activeTab === 'dashboard' ? 'Overview' : activeTab.replace('-', ' ')}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#DDE7E5] text-xs">
                            <span className={`w-2 h-2 rounded-full ${realStats.isOnline ? 'bg-[#15803D]' : 'bg-[#DC2626]'}`} />
                            <span className="text-[#4B5F5C]">{realStats.isOnline ? 'Online' : 'Offline'}</span>
                        </div>

                        <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary !h-9 !px-3.5 text-xs"
                        >
                            View site
                        </a>
                    </div>
                </header>

                {/* Dashboard Overview */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            {stats.map((stat, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white p-5 rounded-[12px] border border-[#DDE7E5] shadow-sm flex items-center justify-between"
                                >
                                    <div>
                                        <p className="text-xs text-[#8A9B98] mb-1 font-medium">{stat.label}</p>
                                        <h3 className="text-2xl font-semibold text-[#102A28]">{stat.value}</h3>
                                    </div>
                                    <div className="w-10 h-10 rounded-[8px] bg-[#E6F4F2] text-[#0F766E] flex items-center justify-center">
                                        <stat.icon size={20} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Analytics & Tools Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Main Chart - Spans 8 cols */}
                            <div className="lg:col-span-8 space-y-6">
                                <VisitorChart />

                                <div className="grid md:grid-cols-2 gap-6">
                                    <VisitorMap />

                                    {/* Quick Actions */}
                                    <div className="bg-white p-6 rounded-[12px] border border-[#DDE7E5] shadow-sm">
                                        <h3 className="text-base font-semibold text-[#102A28] mb-4 flex items-center gap-2">
                                            <Command className="text-[#0F766E]" size={18} />
                                            <span>Quick actions</span>
                                        </h3>
                                        <div className="space-y-2">
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('projects')}
                                                className="w-full flex items-center justify-between p-3 bg-[#F7FAFA] hover:bg-[#EEF4F3] text-[#102A28] rounded-[8px] border border-[#DDE7E5] transition-colors text-sm font-medium text-left"
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <Folder size={16} className="text-[#0F766E]" />
                                                    <span>Manage projects</span>
                                                </div>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('blog')}
                                                className="w-full flex items-center justify-between p-3 bg-[#F7FAFA] hover:bg-[#EEF4F3] text-[#102A28] rounded-[8px] border border-[#DDE7E5] transition-colors text-sm font-medium text-left"
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <FileText size={16} className="text-[#0F766E]" />
                                                    <span>Write new blog post</span>
                                                </div>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('messages')}
                                                className="w-full flex items-center justify-between p-3 bg-[#F7FAFA] hover:bg-[#EEF4F3] text-[#102A28] rounded-[8px] border border-[#DDE7E5] transition-colors text-sm font-medium text-left"
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <MessageSquare size={16} className="text-[#0F766E]" />
                                                    <span>View contact messages</span>
                                                </div>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('settings')}
                                                className="w-full flex items-center justify-between p-3 bg-[#F7FAFA] hover:bg-[#EEF4F3] text-[#102A28] rounded-[8px] border border-[#DDE7E5] transition-colors text-sm font-medium text-left"
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <Shield size={16} className="text-[#0F766E]" />
                                                    <span>Portfolio settings</span>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar: System Health & Tasks */}
                            <div className="lg:col-span-4 space-y-6">
                                <AdminTodoList />

                                <div className="bg-white rounded-[12px] border border-[#DDE7E5] p-6 shadow-sm">
                                    <h3 className="text-base font-semibold text-[#102A28] mb-4 flex items-center gap-2">
                                        <Shield className="text-[#0F766E]" size={18} />
                                        <span>System status</span>
                                    </h3>
                                    <div className="space-y-4 text-sm">
                                        <div className="flex items-center justify-between pb-3 border-b border-[#DDE7E5]">
                                            <span className="text-[#4B5F5C]">Database</span>
                                            <span className="text-xs font-medium text-[#15803D] flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 bg-[#15803D] rounded-full" /> Connected
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between pb-3 border-b border-[#DDE7E5]">
                                            <span className="text-[#4B5F5C]">Cloud sync</span>
                                            <span className="text-xs font-medium text-[#15803D]">Operational</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[#4B5F5C]">Environment</span>
                                            <span className="text-xs font-medium text-[#102A28]">Production</span>
                                        </div>
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
                {activeTab === 'btech-journey' && <AdminBtechJourney />}

            </main>
        </div>
    );
};

export default Dashboard;
