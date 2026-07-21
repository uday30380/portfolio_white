import React, { useState } from 'react';
import { auth, db } from '../../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Shield, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars // eslint-disable-line no-unused-vars
import { doc, getDoc } from 'firebase/firestore';
import { ADMIN_EMAILS, AUTO_PROVISION_PASSWORD, SYSTEM_PROXY_PASSWORD } from '../../config/admin';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Check if input is Email or Username
            const isEmail = email.includes('@');

            if (isEmail) {
                // Standard Email Login
                await signInWithEmailAndPassword(auth, email, password);
                navigate('/admin');
            } else {
                // Username Login (Proxy)
                const docRef = doc(db, 'content', 'portfolioData');
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const adminCreds = data.settings?.adminCredentials;

                    if (adminCreds &&
                        adminCreds.username === email &&
                        adminCreds.password === password) {

                        // Credentials match! Login as system proxy
                        try {
                            await signInWithEmailAndPassword(auth, 'admin@system.local', SYSTEM_PROXY_PASSWORD);
                            navigate('/admin');
                        } catch (proxyErr) {
                            // If proxy account doesn't exist, create it
                            console.log("Proxy login failed, attempting creation...", proxyErr.code);

                            if (proxyErr.code === 'auth/user-not-found' || proxyErr.code === 'auth/invalid-credential' || proxyErr.code === 'auth/invalid-login-credentials') {
                                try {
                                    await createUserWithEmailAndPassword(auth, 'admin@system.local', SYSTEM_PROXY_PASSWORD);
                                    // Sign in automatically happens on create, but we can explicit navigate
                                    navigate('/admin');
                                } catch (createErr) {
                                    // If create fails because it already exists (race condition), try sign in again
                                    if (createErr.code === 'auth/email-already-in-use') {
                                        await signInWithEmailAndPassword(auth, 'admin@system.local', SYSTEM_PROXY_PASSWORD);
                                        navigate('/admin');
                                    } else {
                                        console.error("Proxy creation failed:", createErr);
                                        throw new Error(`System Error: Proxy account provision failed (${createErr.code})`);
                                    }
                                }
                            } else {
                                throw proxyErr;
                            }
                        }
                    } else if (!adminCreds && email === 'admin' && password === 'admin123') {
                        // FALLBACK: Default credentials for initial setup
                        // Only works if no custom credentials have been set in Admin Settings yet.
                        try {
                            await signInWithEmailAndPassword(auth, 'admin@system.local', SYSTEM_PROXY_PASSWORD);
                            navigate('/admin');
                        } catch (proxyErr) {
                            if (proxyErr.code === 'auth/user-not-found' || proxyErr.code === 'auth/invalid-credential' || proxyErr.code === 'auth/invalid-login-credentials') {
                                try {
                                    await createUserWithEmailAndPassword(auth, 'admin@system.local', SYSTEM_PROXY_PASSWORD);
                                    navigate('/admin');
                                } catch (createErr) {
                                    if (createErr.code === 'auth/email-already-in-use') {
                                        await signInWithEmailAndPassword(auth, 'admin@system.local', SYSTEM_PROXY_PASSWORD);
                                        navigate('/admin');
                                    } else {
                                        throw new Error(`System Error: Proxy provisioning failed (${createErr.code})`);
                                    }
                                }
                            } else {
                                throw proxyErr;
                            }
                        }
                    } else {
                        throw new Error("Invalid Username or Password");
                    }
                } else {
                    throw new Error("System Error: Configuration not found");
                }
            }
        } catch (err) {
            // Auto-provisioning for specific admin if they don't exist (Legacy)
            if (ADMIN_EMAILS.includes(email) && password === AUTO_PROVISION_PASSWORD) {
                try {
                    await createUserWithEmailAndPassword(auth, email, password);
                    navigate('/admin');
                    return;
                } catch (createErr) {
                    console.error("Auto-provision failed:", createErr);
                }
            }
            console.error("Login error:", err);
            console.error("Login error:", err);
            setError(`Error: ${err.message} (${err.code || 'No Code'})`);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] -ml-48 -mb-48"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-500 rounded-3xl shadow-2xl shadow-orange-500/20 mb-8 animate-bounce-slow">
                        <Shield size={40} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight uppercase mb-2">System Access</h1>
                    <p className="text-gray-500 font-bold text-xs uppercase tracking-[0.3em]">Administrator Authentication</p>
                </div>

                <div className="bg-[#111111] p-10 rounded-[40px] border border-white/5 shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Terminal ID (Email / Username)</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-orange-500 transition-colors" size={18} />
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
                                    placeholder="admin@jcrea.com or username"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Access Token (Password)</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-orange-500 transition-colors" size={18} />
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold text-center">
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-5 rounded-2xl transition-all duration-300 shadow-xl shadow-orange-500/20 flex items-center justify-center gap-3 active:scale-[0.98] group"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    SECURE LOGIN <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="text-center mt-12">
                    <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em]">
                        Cloud Infrastructure © 2024 VEMPATI UDAY KIRAN
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
