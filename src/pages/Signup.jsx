import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    createUserWithEmailAndPassword,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { auth } from '../firebase';
import { Mail, Lock, User as UserIcon, ArrowRight, Chrome } from 'lucide-react';
import PageWrapper from '../components/public/PageWrapper';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, {
                displayName: name
            });
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <PageWrapper className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden font-sans">
            {/* Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>

            <div className="max-w-md w-full px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-900 rounded-[50px] p-10 md:p-12 shadow-2xl relative overflow-hidden group"
                >
                    {/* Decorative Element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>

                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 rounded-2xl mb-6 border border-white/10 group-hover:border-orange-500/50 transition-colors">
                            <UserIcon size={28} className="text-orange-500" />
                        </div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Create Account<span className="text-orange-500">.</span></h2>
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mt-4">Join our elite network</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-red-500/10 text-red-500 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest mb-8 border border-red-500/20 text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSignup} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Full Designation</label>
                            <div className="relative group/field">
                                <UserIcon size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within/field:text-orange-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Enter full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-16 pr-6 py-5 bg-white/5 border border-white/5 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold placeholder:text-gray-800"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Digital Identity</label>
                            <div className="relative group/field">
                                <Mail size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within/field:text-orange-500 transition-colors" />
                                <input
                                    type="email"
                                    placeholder="yourname@node.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-16 pr-6 py-5 bg-white/5 border border-white/5 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold placeholder:text-gray-800"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Secure Protocol</label>
                            <div className="relative group/field">
                                <Lock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within/field:text-orange-500 transition-colors" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-16 pr-6 py-5 bg-white/5 border border-white/5 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold placeholder:text-gray-800"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-orange-500/20 uppercase text-xs tracking-[0.2em] active:scale-[0.98] flex items-center justify-center gap-3"
                        >
                            Request Access <ArrowRight size={18} />
                        </button>
                    </form>

                    <div className="relative my-10">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/5"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-gray-900 text-gray-600 text-[10px] font-black uppercase tracking-widest">or</span>
                        </div>
                    </div>

                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full flex items-center justify-center gap-4 py-5 px-6 bg-white/5 hover:bg-white text-gray-400 hover:text-gray-900 rounded-2xl transition-all border border-white/5 font-black uppercase text-[10px] tracking-widest"
                    >
                        <Chrome size={20} />
                        Sync with Google
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-10 text-center"
                >
                    <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
                        Already Registered? <Link to="/login" className="text-orange-500 hover:underline">Establish Link</Link>
                    </div>
                </motion.div>
            </div>
        </PageWrapper>
    );
};

export default Signup;
