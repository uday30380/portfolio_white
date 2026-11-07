import React from 'react';
import { Layout, Folder, FileText, Settings, Users, MessageSquare, Award, LogOut, ExternalLink, Image as ImageIcon, X, Trophy, GraduationCap } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';

const AdminSidebar = ({ activeTab, setActiveTab, isOpen, onClose }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        if (!window.confirm("Sign out of Admin Panel?")) return;
        await signOut(auth);
        navigate('/admin/login');
    };

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Layout },
        { id: 'projects', label: 'Projects', icon: Folder },
        { id: 'skills', label: 'Skills', icon: Award },
        { id: 'blog', label: 'Blog', icon: FileText },
        { id: 'honors', label: 'Honors', icon: Trophy },
        { id: 'btech-journey', label: 'B.Tech Journey', icon: GraduationCap },
        { id: 'messages', label: 'Inbox', icon: MessageSquare },
        { id: 'social-proof', label: 'Social Proof', icon: Award },
        { id: 'media', label: 'Assets', icon: ImageIcon },
        { id: 'profile', label: 'Profile', icon: Users },
        { id: 'resume', label: 'Resume', icon: FileText },
        { id: 'footer', label: 'Footer Section', icon: Layout },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <aside className={`w-64 bg-white border-r border-[#DDE7E5] flex flex-col h-screen fixed left-0 top-0 z-50 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-6 border-b border-[#DDE7E5] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-[8px] bg-[#E6F4F2] text-[#0F766E] flex items-center justify-center font-semibold">
                        <Settings size={18} />
                    </div>
                    <div>
                        <span className="font-semibold text-sm block text-[#102A28]">Admin Panel</span>
                        <span className="text-xs text-[#8A9B98] leading-none">Uday Kiran Vempati</span>
                    </div>
                </div>
                {/* Mobile Close Button */}
                <button
                    onClick={onClose}
                    className="lg:hidden p-1.5 text-[#4B5F5C] hover:text-[#0F766E] hover:bg-[#E6F4F2] rounded-lg transition-colors"
                >
                    <X size={18} />
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                {navItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                                if (window.innerWidth < 1024) onClose();
                            }}
                            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[8px] text-sm font-medium transition-colors ${
                                isActive
                                    ? 'bg-[#E6F4F2] text-[#0F766E]'
                                    : 'text-[#4B5F5C] hover:bg-[#E6F4F2] hover:text-[#0F766E]'
                            }`}
                        >
                            <item.icon size={17} className={isActive ? 'text-[#0F766E]' : 'text-[#8A9B98]'} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-[#DDE7E5] space-y-1.5">
                <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between px-3.5 py-2 rounded-[8px] text-xs font-medium text-[#4B5F5C] hover:bg-[#EEF4F3] hover:text-[#102A28] transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <ExternalLink size={14} className="text-[#8A9B98]" />
                        <span>Public site</span>
                    </div>
                    <span className="text-[10px] text-[#8A9B98]">Open</span>
                </a>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3.5 py-2 rounded-[8px] text-xs font-medium text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
                >
                    <LogOut size={14} />
                    <span>Sign out</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
