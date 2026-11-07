import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Mail, Trash2, CheckCircle, Clock, MessageSquare, ArrowRight } from 'lucide-react';

const AdminMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setMessages(msgs);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const toggleRead = async (id, currentStatus) => {
        await updateDoc(doc(db, 'messages', id), { read: !currentStatus });
    };

    const deleteMessage = async (id) => {
        if (window.confirm('Delete this message?')) {
            await deleteDoc(doc(db, 'messages', id));
        }
    };

    const filteredMessages = messages.filter(msg => {
        if (filter === 'unread') return !msg.read;
        if (filter === 'read') return msg.read;
        return true;
    });

    const formatTimestamp = (createdAt) => {
        if (!createdAt) return 'Recent';
        if (typeof createdAt.toDate === 'function') {
            return createdAt.toDate().toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        }
        return new Date(createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="space-y-6 text-[#102A28]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-[#102A28]">Inbox</h2>
                    <p className="text-xs text-[#8A9B98]">Messages submitted via the contact form</p>
                </div>

                <div className="flex items-center gap-1.5 p-1 bg-[#EEF4F3] rounded-[8px] border border-[#DDE7E5]">
                    <button
                        type="button"
                        onClick={() => setFilter('all')}
                        className={`px-3 py-1.5 rounded-[6px] text-xs font-medium transition-colors ${
                            filter === 'all'
                                ? 'bg-white text-[#102A28] shadow-sm'
                                : 'text-[#4B5F5C] hover:text-[#0F766E]'
                        }`}
                    >
                        All ({messages.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilter('unread')}
                        className={`px-3 py-1.5 rounded-[6px] text-xs font-medium transition-colors ${
                            filter === 'unread'
                                ? 'bg-white text-[#102A28] shadow-sm'
                                : 'text-[#4B5F5C] hover:text-[#0F766E]'
                        }`}
                    >
                        Unread ({messages.filter(m => !m.read).length})
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-2">
                        <div className="w-6 h-6 border-2 border-[#DDE7E5] border-t-[#0F766E] rounded-full animate-spin" />
                        <p className="text-xs text-[#8A9B98]">Loading messages...</p>
                    </div>
                ) : filteredMessages.length > 0 ? (
                    filteredMessages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`p-5 rounded-[12px] border transition-colors ${
                                msg.read
                                    ? 'bg-white border-[#DDE7E5]'
                                    : 'bg-[#EEF4F3]/30 border-[#102A28]'
                            } shadow-sm`}
                        >
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                                            msg.read ? 'bg-[#EEF4F3] text-[#4B5F5C]' : 'bg-[#EEF4F3] text-[#102A28]'
                                        }`}>
                                            <Mail size={14} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-sm text-[#102A28]">{msg.name}</h4>
                                            <p className="text-xs text-[#4B5F5C]">{msg.email}</p>
                                        </div>
                                        {!msg.read && (
                                            <span className="px-2 py-0.5 bg-[#EEF4F3] text-[#102A28] text-[10px] font-medium rounded-full">
                                                New
                                            </span>
                                        )}
                                    </div>

                                    <div className="bg-[#F7FAFA] p-3.5 rounded-[8px] border border-[#DDE7E5]">
                                        <p className="text-sm text-[#102A28] leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                                    </div>
                                </div>

                                <div className="flex md:flex-col justify-between items-end border-t md:border-t-0 md:border-l border-[#DDE7E5] pt-3 md:pt-0 md:pl-6 min-w-[150px] gap-3">
                                    <div className="text-right text-xs text-[#8A9B98] flex items-center gap-1.5">
                                        <Clock size={12} />
                                        <span>{formatTimestamp(msg.createdAt)}</span>
                                    </div>

                                    <div className="flex gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => toggleRead(msg.id, msg.read)}
                                            className={`p-2 rounded-[6px] border text-xs font-medium transition-colors ${
                                                msg.read
                                                    ? 'bg-white border-[#DDE7E5] text-[#4B5F5C] hover:bg-[#EEF4F3]'
                                                    : 'bg-[#EEF4F3] border-[#102A28] text-[#102A28]'
                                            }`}
                                            title={msg.read ? "Mark as unread" : "Mark as read"}
                                        >
                                            <CheckCircle size={15} />
                                        </button>
                                        <a
                                            href={`mailto:${msg.email}?subject=Re: Your Message to Uday Kiran`}
                                            className="p-2 bg-white border border-[#DDE7E5] text-[#4B5F5C] hover:text-[#0F766E] hover:bg-[#EEF4F3] rounded-[6px] transition-colors"
                                            title="Reply via email"
                                        >
                                            <ArrowRight size={15} />
                                        </a>
                                        <button
                                            type="button"
                                            onClick={() => deleteMessage(msg.id)}
                                            className="p-2 bg-white border border-[#DDE7E5] text-[#DC2626] hover:bg-[#FEF2F2] rounded-[6px] transition-colors"
                                            title="Delete message"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[12px] border border-[#DDE7E5] text-center p-6">
                        <MessageSquare size={36} className="text-[#8A9B98] mb-3" />
                        <h3 className="text-base font-semibold text-[#102A28] mb-1">No messages</h3>
                        <p className="text-xs text-[#8A9B98]">No inquiries in this filter</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminMessages;
