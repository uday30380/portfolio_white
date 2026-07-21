import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Mail, Trash2, CheckCircle, Clock, Search, MessageSquare, Filter, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

const AdminMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMessages(msgs);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const toggleRead = async (id, currentStatus) => {
        await updateDoc(doc(db, 'messages', id), { read: !currentStatus });
    };

    const deleteMessage = async (id) => {
        if (window.confirm('Erase this message transcript?')) {
            await deleteDoc(doc(db, 'messages', id));
        }
    };

    const filteredMessages = messages.filter(msg => {
        if (filter === 'unread') return !msg.read;
        if (filter === 'read') return msg.read;
        return true;
    });

    return (
        <div className="space-y-10 animate-fade-in relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-[2px] bg-orange-500"></div>
                        <span className="text-[10px] font-black tracking-[0.3em] text-orange-500 uppercase">Communications</span>
                    </div>
                    <h2 className="text-3xl font-black text-white">Central Inbox</h2>
                </div>

                <div className="flex items-center gap-3 p-2 bg-white/5 rounded-2xl border border-white/5">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px - 6 py - 2 rounded - xl text - [10px] font - black uppercase tracking - widest transition - all ${filter === 'all' ? 'bg-orange-500 text-white' : 'text-gray-500 hover:text-white'} `}
                    >
                        Total ({messages.length})
                    </button>
                    <button
                        onClick={() => setFilter('unread')}
                        className={`px - 6 py - 2 rounded - xl text - [10px] font - black uppercase tracking - widest transition - all ${filter === 'unread' ? 'bg-orange-500 text-white' : 'text-gray-500 hover:text-white'} `}
                    >
                        New ({messages.filter(m => !m.read).length})
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Scanning Network...</p>
                    </div>
                ) : filteredMessages.length > 0 ? (
                    <div className="grid gap-4">
                        {filteredMessages.map((msg) => (
                            <motion.div
                                layout
                                key={msg.id}
                                className={`group p - 8 rounded - [32px] border transition - all duration - 300 ${msg.read ? 'bg-white/5 border-white/5' : 'bg-orange-500/5 border-orange-500/20 shadow-xl shadow-orange-500/5'} `}
                            >
                                <div className="flex flex-col lg:flex-row justify-between gap-8">
                                    <div className="flex-1 space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`w - 12 h - 12 rounded - 2xl flex items - center justify - center ${msg.read ? 'bg-white/5 text-gray-400' : 'bg-orange-500 text-white shadow-lg'} `}>
                                                <Mail size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-white tracking-tight">{msg.name}</h4>
                                                <p className="text-xs font-bold text-orange-500/60 lowercase">{msg.email}</p>
                                            </div>
                                            {!msg.read && (
                                                <span className="ml-4 px-2 py-0.5 bg-orange-500 text-[8px] font-black text-white uppercase rounded tracking-widest animate-pulse">New</span>
                                            )}
                                        </div>
                                        <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                                            <p className="text-sm font-medium text-gray-400 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-row lg:flex-col justify-between items-end border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0 lg:pl-10 min-w-[180px]">
                                        <div className="text-right">
                                            <div className="flex items-center gap-2 text-gray-600 justify-end mb-1">
                                                <Clock size={14} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Received</span>
                                            </div>
                                            <div className="text-xs font-bold text-white">
                                                {msg.createdAt?.toDate().toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) || 'Unknown'}
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => toggleRead(msg.id, msg.read)}
                                                className={`p - 4 rounded - xl transition - all ${msg.read ? 'bg-white/5 text-gray-500 hover:bg-orange-500/20 hover:text-orange-500' : 'bg-orange-500 text-white shadow-lg shadow-orange-500/20 hover:scale-110'} `}
                                                title={msg.read ? "Mark as Unread" : "Mark as Read"}
                                            >
                                                <CheckCircle size={18} />
                                            </button>
                                            <a
                                                href={`mailto:${msg.email}?subject = Re: Your Message to Uday Kiran`}
                                                className="p-4 bg-white/5 text-gray-500 hover:bg-white hover:text-black rounded-xl transition-all"
                                                title="Reply Email"
                                            >
                                                <ArrowRight size={18} />
                                            </a>
                                            <button
                                                onClick={() => deleteMessage(msg.id)}
                                                className="p-4 bg-white/5 text-gray-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                                                title="Delete Message"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-40 bg-white/5 rounded-[48px] border border-dashed border-white/10 text-center">
                        <MessageSquare size={64} className="text-gray-800 mb-6" />
                        <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Inbox Empty</h3>
                        <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">Frequency scanning for new signals...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminMessages;
