import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { auth } from '../firebase';
import { Mail, Lock, LogIn, Chrome, ArrowLeft, User as UserIcon, ArrowRight, Loader2 } from 'lucide-react';
import PageWrapper from '../components/public/PageWrapper';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Artificial delay for 2 seconds
            await new Promise(resolve => setTimeout(resolve, 2000));

            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(userCredential.user, {
                    displayName: name
                });
            }
            navigate('/admin');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            navigate('/admin');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <PageWrapper className="min-h-screen flex items-center justify-center bg-[#000000] relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

            <div className="max-w-md w-full px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0f0f0f]/80 backdrop-blur-2xl rounded-[40px] p-10 md:p-12 shadow-2xl relative overflow-hidden group border border-white/5"
                >
                    {/* Decorative Element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-1000"></div>

                    <div className="text-center mb-10">
                        <motion.div
                            key={isLogin ? "login-icon" : "signup-icon"}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-orange-500 to-orange-600 rounded-2xl mb-6 shadow-xl shadow-orange-500/20"
                        >
                            {isLogin ? <LogIn size={28} className="text-white" /> : <UserIcon size={28} className="text-white" />}
                        </motion.div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">
                            {isLogin ? "Welcome Back" : "Create Account"}<span className="text-orange-500">.</span>
                        </h2>
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mt-4">
                            {isLogin ? "Access your interface" : "Join our elite network"}
                        </p>
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

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <AnimatePresence mode="popLayout">
                            {!isLogin && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                    animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
                                    exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                    className="space-y-2"
                                >
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Full Designation</label>
                                    <div className="relative group/field">
                                        <UserIcon size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/field:text-orange-500 transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="Enter full name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full pl-16 pr-6 py-5 bg-white/5 border border-white/5 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium placeholder:text-gray-700"
                                            required={!isLogin}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Identity</label>
                            <div className="relative group/field">
                                <Mail size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/field:text-orange-500 transition-colors" />
                                <input
                                    type="email"
                                    placeholder="yourname@node.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-16 pr-6 py-5 bg-white/5 border border-white/5 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium placeholder:text-gray-700"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Access Protocol</label>
                            <div className="relative group/field">
                                <Lock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/field:text-orange-500 transition-colors" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-16 pr-6 py-5 bg-white/5 border border-white/5 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium placeholder:text-gray-700"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-orange-500/20 uppercase text-xs tracking-[0.2em] active:scale-[0.98] transform group-hover:shadow-orange-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    {isLogin ? "Login" : "Sign Up"}
                                    {!isLogin && <ArrowRight size={16} />}
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative my-10">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/5"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-[#0f0f0f] text-gray-600 text-[10px] font-black uppercase tracking-widest">or</span>
                        </div>
                    </div>

                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full flex items-center justify-center gap-4 py-5 px-6 bg-white/5 hover:bg-white text-gray-400 hover:text-gray-900 rounded-2xl transition-all border border-white/5 font-black uppercase text-[10px] tracking-widest group/google hover:shadow-lg"
                    >
                        <Chrome size={20} className="group-hover/google:text-blue-500 transition-colors" />
                        Continue with Google
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-10 text-center space-y-4"
                >
                    <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-500 transition-all font-black uppercase text-[10px] tracking-widest group">
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> BACK TO HOME
                    </Link>
                    <div className="text-gray-500 text-[10px] font-black uppercase tracking-widest">
                        {isLogin ? "New Node?" : "Already Linked?"}
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                            }}
                            className="text-orange-500 hover:text-orange-400 ml-2 hover:underline transition-colors"
                        >
                            {isLogin ? "Sign Up" : "Login"}
                        </button>
                    </div>
                </motion.div>
            </div>
        </PageWrapper>
    );
};

export default Login;
