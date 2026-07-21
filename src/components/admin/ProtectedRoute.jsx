import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';
import { ADMIN_EMAILS } from '../../config/admin';

const ProtectedRoute = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            // Strict email check for admin access
            if (currentUser && ADMIN_EMAILS.includes(currentUser.email)) {
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-[#050b14] text-white">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#050b14] text-white p-4 text-center">
                <div className="bg-red-500/10 p-4 rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
                <p className="text-slate-400 mb-8 max-w-md">
                    You do not have permission to access the admin dashboard. This area is restricted to authorized personnel only.
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={() => auth.signOut()}
                        className="px-6 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors"
                    >
                        Sign Out
                    </button>
                    <a
                        href="/"
                        className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Return Home
                    </a>
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
