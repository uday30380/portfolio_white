import React, { useState } from 'react';
import { auth, db } from '../../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Shield, ArrowRight, ArrowLeft } from 'lucide-react';
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
            const isEmail = email.includes('@');

            if (isEmail) {
                await signInWithEmailAndPassword(auth, email, password);
                navigate('/admin');
            } else {
                const docRef = doc(db, 'content', 'portfolioData');
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const adminCreds = data.settings?.adminCredentials;

                    if (adminCreds &&
                        adminCreds.username === email &&
                        adminCreds.password === password) {

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
                                        throw createErr;
                                    }
                                }
                            } else {
                                throw proxyErr;
                            }
                        }
                    } else {
                        throw new Error("Invalid username or password");
                    }
                } else {
                    throw new Error("Unable to verify credentials");
                }
            }
        } catch (err) {
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
            setError(`Error: ${err.message} (${err.code || 'Check details'})`);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F7FAFA] text-[#102A28] flex items-center justify-center p-6 font-sans">
            <div className="w-full max-w-md">
                <div className="mb-6">
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#4B5F5C] hover:text-[#0F766E] transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to home
                    </button>
                </div>

                <div className="bg-white rounded-[12px] p-8 md:p-10 border border-[#DDE7E5] shadow-sm">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-[#E6F4F2] text-[#0F766E] rounded-full mb-4">
                            <Shield size={24} />
                        </div>
                        <h1 className="text-2xl font-semibold text-[#102A28] mb-2">Admin Sign In</h1>
                        <p className="text-sm text-[#4B5F5C]">Authenticate to access portfolio dashboard</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Email or Username</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9B98]" size={16} />
                                <input
                                    type="text"
                                    required
                                    className="w-full pl-10 pr-3.5 h-[44px] bg-[#FFFFFF] border border-[#DDE7E5] rounded-[8px] text-sm text-[#102A28] placeholder:text-[#8A9B98] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2] transition-colors"
                                    placeholder="admin@example.com or username"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9B98]" size={16} />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-10 pr-3.5 h-[44px] bg-[#FFFFFF] border border-[#DDE7E5] rounded-[8px] text-sm text-[#102A28] placeholder:text-[#8A9B98] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2] transition-colors"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-[#FEF2F2] border border-[#FCA5A5] rounded-[8px] text-[#DC2626] text-xs font-medium text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full !mt-6"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>Sign in</span>
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="text-center mt-6 pt-6 border-t border-[#DDE7E5]">
                        <p className="text-[#8A9B98] text-xs">
                            Uday Kiran Vempati &bull; Portfolio Administrator
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
