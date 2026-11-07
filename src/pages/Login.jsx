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
import { Mail, Lock, ArrowLeft, User as UserIcon, Loader2 } from 'lucide-react';

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
        <div className="min-h-screen flex items-center justify-center bg-[#F7FAFA] text-[#102A28] p-6 font-sans">
            <div className="max-w-md w-full">
                <div className="mb-6">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#4B5F5C] hover:text-[#0F766E] transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to home
                    </Link>
                </div>

                <div className="bg-white rounded-[12px] p-8 md:p-10 border border-[#DDE7E5] shadow-sm">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-semibold text-[#102A28] mb-2">
                            {isLogin ? "Sign in to account" : "Create account"}
                        </h1>
                        <p className="text-sm text-[#4B5F5C]">
                            {isLogin ? "Enter your credentials to manage portfolio content" : "Enter details to create an administrator profile"}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-[#FEF2F2] text-[#DC2626] p-3 rounded-[8px] text-xs font-medium mb-6 border border-[#FCA5A5] text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div>
                                <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Full name</label>
                                <div className="relative">
                                    <UserIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9B98]" />
                                    <input
                                        type="text"
                                        placeholder="Uday Kiran"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-10 pr-3.5 h-[44px] bg-[#FFFFFF] border border-[#DDE7E5] rounded-[8px] text-sm text-[#102A28] placeholder:text-[#8A9B98] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2] transition-colors"
                                        required={!isLogin}
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Email address</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9B98]" />
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-3.5 h-[44px] bg-[#FFFFFF] border border-[#DDE7E5] rounded-[8px] text-sm text-[#102A28] placeholder:text-[#8A9B98] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2] transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-[#4B5F5C] mb-1.5">Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9B98]" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-3.5 h-[44px] bg-[#FFFFFF] border border-[#DDE7E5] rounded-[8px] text-sm text-[#102A28] placeholder:text-[#8A9B98] focus:outline-none focus:border-[#7CC7BD] focus:ring-[3px] focus:ring-[#E6F4F2] transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full !mt-6"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    <span>Please wait...</span>
                                </>
                            ) : (
                                <span>{isLogin ? "Sign in" : "Create account"}</span>
                            )}
                        </button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[#DDE7E5]"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-3 bg-white text-[#8A9B98]">or</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        className="btn-secondary w-full"
                    >
                        Sign in with Google
                    </button>

                    <div className="mt-6 text-center text-xs text-[#4B5F5C]">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                            }}
                            className="text-[#0F766E] font-medium ml-1.5 hover:underline"
                        >
                            {isLogin ? "Sign up" : "Sign in"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
