import React, { useState } from 'react';
import { Mail, Phone, Send, Check } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Contact = () => {
    const { data } = useData() || {};
    const email = data?.contact?.email || 'udaykiranvempati123@gmail.com';
    const phone = data?.contact?.phone || '+91 81858 92753';

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        hp_check: ''
    });
    const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error'
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (formData.hp_check) {
            setStatus('success');
            setFormData({ name: '', email: '', message: '', hp_check: '' });
            return;
        }

        const trimmedName = formData.name.trim();
        const trimmedEmail = formData.email.trim();
        const trimmedMessage = formData.message.trim();

        if (!trimmedName || !trimmedEmail || !trimmedMessage) {
            setStatus('error');
            setErrorMessage('Please fill in all fields.');
            return;
        }

        setStatus('sending');

        try {
            await addDoc(collection(db, 'messages'), {
                name: trimmedName,
                email: trimmedEmail,
                message: trimmedMessage,
                timestamp: serverTimestamp(),
                read: false,
                createdAt: new Date().toISOString()
            });

            setStatus('success');
            setFormData({ name: '', email: '', message: '', hp_check: '' });
        } catch (err) {
            console.error('Contact submission error:', err);
            setStatus('error');
            setErrorMessage('Unable to send message right now. Please email me directly.');
        }
    };

    return (
        <section id="contact" className="py-16 md:py-24 bg-[#F7FAFA] border-t border-[#DDE7E5]">
            <div className="max-w-[1100px] mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    {/* Left Column: Direct Info */}
                    <div className="md:col-span-5">
                        <h2 className="text-2xl md:text-3xl font-semibold text-[#102A28] mb-3">
                            Contact
                        </h2>
                        <p className="text-base text-[#4B5F5C] leading-relaxed mb-8">
                            Feel free to reach out for project inquiries, collaboration, or full-time opportunities. I typically respond within 24 hours.
                        </p>

                        <div className="space-y-4">
                            <a
                                href={`mailto:${email}`}
                                className="flex items-center gap-3 p-3.5 rounded-lg border border-[#DDE7E5] bg-[#FFFFFF] hover:bg-[#E6F4F2] hover:border-[#7CC7BD] transition-all text-sm text-[#102A28] font-medium"
                            >
                                <Mail size={18} className="text-[#0F766E]" />
                                <span>{email}</span>
                            </a>

                            <a
                                href={`tel:${phone.replace(/\s+/g, '')}`}
                                className="flex items-center gap-3 p-3.5 rounded-lg border border-[#DDE7E5] bg-[#FFFFFF] hover:bg-[#E6F4F2] hover:border-[#7CC7BD] transition-all text-sm text-[#102A28] font-medium"
                            >
                                <Phone size={18} className="text-[#0F766E]" />
                                <span>{phone}</span>
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Simple Form */}
                    <div className="md:col-span-7">
                        <div className="bg-[#FFFFFF] border border-[#DDE7E5] rounded-xl p-6 md:p-8 shadow-sm">
                            {status === 'success' ? (
                                <div className="py-8 text-center">
                                    <div className="w-12 h-12 rounded-full bg-[#E6F4F2] text-[#0F766E] flex items-center justify-center mx-auto mb-4">
                                        <Check size={24} />
                                    </div>
                                    <h3 className="text-xl font-semibold text-[#102A28] mb-2">
                                        Message sent
                                    </h3>
                                    <p className="text-sm text-[#4B5F5C] max-w-sm mx-auto mb-6">
                                        Thank you for getting in touch. I've received your note and will get back to you soon.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setStatus('idle')}
                                        className="btn-secondary"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Honeypot field for bot protection */}
                                    <input
                                        type="text"
                                        name="hp_check"
                                        value={formData.hp_check}
                                        onChange={(e) => setFormData({ ...formData, hp_check: e.target.value })}
                                        className="hidden"
                                        tabIndex={-1}
                                        autoComplete="off"
                                    />

                                    <div>
                                        <label htmlFor="contact-name" className="block text-sm font-medium text-[#102A28] mb-1.5">
                                             Name
                                        </label>
                                        <input
                                            id="contact-name"
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Your full name"
                                            className="w-full h-11 px-3.5 rounded-lg border border-[#DDE7E5] bg-[#FFFFFF] text-[#102A28] placeholder:text-[#8A9B98] text-sm focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2] transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="contact-email" className="block text-sm font-medium text-[#102A28] mb-1.5">
                                            Email
                                        </label>
                                        <input
                                            id="contact-email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="you@example.com"
                                            className="w-full h-11 px-3.5 rounded-lg border border-[#DDE7E5] bg-[#FFFFFF] text-[#102A28] placeholder:text-[#8A9B98] text-sm focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2] transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="contact-message" className="block text-sm font-medium text-[#102A28] mb-1.5">
                                            Message
                                        </label>
                                        <textarea
                                            id="contact-message"
                                            required
                                            rows={5}
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            placeholder="Tell me about your project, team, or opportunity..."
                                            className="w-full p-3.5 rounded-lg border border-[#DDE7E5] bg-[#FFFFFF] text-[#102A28] placeholder:text-[#8A9B98] text-sm focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2] transition-all resize-y leading-relaxed"
                                        />
                                    </div>

                                    {status === 'error' && errorMessage && (
                                        <p className="text-sm text-[#102A28] font-medium">
                                            {errorMessage}
                                        </p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={status === 'sending'}
                                        className="btn-primary w-full sm:w-auto"
                                    >
                                        <span>{status === 'sending' ? 'Sending...' : 'Send message'}</span>
                                        <Send size={15} />
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;