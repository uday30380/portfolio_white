import React from 'react';
import { Layout, Folder, FileText, Settings, Users, MessageSquare, Award, LogOut, ExternalLink, Image as ImageIcon, X, Trophy } from 'lucide-react';
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
        { id: 'messages', label: 'Inbox', icon: MessageSquare },
        { id: 'social-proof', label: 'Social Proof', icon: Award },
        { id: 'media', label: 'Assets', icon: ImageIcon },
        { id: 'profile', label: 'Profile', icon: Users },
        { id: 'resume', label: 'Resume Config', icon: FileText },
        { id: 'footer', label: 'Footer Section', icon: Layout },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <aside className={`w-64 bg-[#0F0F0F] border-r border-white/5 flex flex-col h-screen fixed left-0 top-0 z-50 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3 text-white">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white font-black relative overflow-hidden group">
                        <div className="absolute inset-0 bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <Settings size={20} className="relative z-10" />
                    </div>
                    <div>
                        <span className="font-black text-lg block tracking-wider uppercase">VUK</span>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">VEMPATI UDAY KIRAN</span>
                    </div>
                </div>
                {/* Mobile Close Button */}
                <button
                    onClick={onClose}
                    className="lg:hidden p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2 custom-scrollbar">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => {
                            setActiveTab(item.id);
                            if (window.innerWidth < 1024) onClose(); // Close on mobile click
                        }}
                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${activeTab === item.id
                            ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/20'
                            : 'text-gray-500 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        <item.icon size={20} className={activeTab === item.id ? 'text-white' : 'group-hover:text-orange-500 transition-colors'} />
                        <span className="font-bold text-sm tracking-wide">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="p-6 border-t border-white/5 space-y-3">
                <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center gap-3 px-5 py-4 text-gray-400 hover:bg-orange-500/10 hover:text-orange-500 rounded-2xl border border-transparent hover:border-orange-500/20 transition-all font-bold text-sm"
                >
                    <ExternalLink size={18} />
                    View Live Site
                </a>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-5 py-4 text-red-400/60 hover:text-red-400 hover:bg-red-400/5 rounded-2xl transition-all font-bold text-sm"
                >
                    <LogOut size={18} />
                    Log Out
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
