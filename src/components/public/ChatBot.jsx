import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { AnimatePresence, motion } from 'framer-motion';

const ChatBot = () => {
    const { data } = useData() || {};
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm Uday's AI Assistant. Ask me anything about his skills, projects, or experience!", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // Simple keyword-based AI logic (Portfolio RAG)
    const generateResponse = (query) => {
        const lowerQuery = query.toLowerCase();

        if (lowerQuery.includes('contact') || lowerQuery.includes('email') || lowerQuery.includes('hire')) {
            const email = data?.contact?.email || 'vempatiudaykiran04@gmail.com';
            const phone = data?.contact?.phone || '+91 9390234033';
            return `You can reach Uday at ${email} or call ${phone}.`;
        }
        if (lowerQuery.includes('skill') || lowerQuery.includes('stack') || lowerQuery.includes('technologies')) {
            const topSkills = data.skills?.slice(0, 5).map(s => s.skill).join(', ') || "React, Node.js";
            return `Uday is proficient in ${topSkills} and more! Check out the Skills section for the full list.`;
        }
        if (lowerQuery.includes('project') || lowerQuery.includes('work') || lowerQuery.includes('built')) {
            const project = data.projects?.[0];
            return `Uday has built amazing things! One highlight is "${project?.title || 'his latest work'}" - ${project?.description?.substring(0, 50) || 'a cool project'}... Check the Projects section!`;
        }
        if (lowerQuery.includes('who') || lowerQuery.includes('about')) {
            return data.about?.bio ? data.about.bio.substring(0, 150) + "..." : "Uday is a passionate developer ready to build value.";
        }
        if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
            return "Hello! How can I help you today?";
        }

        return "I'm focusing on Uday's professional work. Ask me about his Skills, Projects, or Contact info!";
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Add User Message
        const userMsg = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI Delay
        setTimeout(() => {
            const responseText = generateResponse(userMsg.text);
            const botMsg = { id: Date.now() + 1, text: responseText, sender: 'bot' };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 1000);
    };

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-8 right-8 z-50 w-14 h-14 bg-gradient-to-tr from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,125,68,0.5)] text-white transition-transform hover:scale-110 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
            >
                <MessageSquare size={24} className="animate-pulse" />
            </button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-8 right-4 md:right-8 z-50 w-[90vw] md:w-[350px] h-[500px] bg-[#050505]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-white/5 to-transparent border-b border-white/5 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/50">
                                    <Bot size={18} className="text-orange-400" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white">UDAY KIRAN'S AI Assistant</h3>
                                    <p className="text-[10px] text-green-400 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/20">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                        ? 'bg-orange-600 text-white rounded-tr-none shadow-lg shadow-orange-900/20'
                                        : 'bg-white/10 border border-white/5 text-gray-200 rounded-tl-none backdrop-blur-sm'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white/10 border border-white/5 rounded-2xl rounded-tl-none p-4 flex gap-1">
                                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></span>
                                        <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="p-4 border-t border-white/5 bg-black/40">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask about Uday..."
                                    className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-4 pr-12 text-sm text-white focus:border-orange-500 outline-none transition-all placeholder:text-gray-600"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-orange-600 text-white rounded-full hover:bg-orange-500 transition-colors disabled:opacity-50"
                                    disabled={!input.trim()}
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatBot;

