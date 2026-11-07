import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';
import { ADMIN_EMAILS } from '../../config/admin';
import { ShieldAlert } from 'lucide-react';

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
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F7FAFA] text-[#102A28]">
                <p className="text-sm text-[#8A9B98]">Loading...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7FAFA] text-[#102A28] p-6 text-center font-sans">
                <div className="max-w-md w-full bg-white border border-[#DDE7E5] rounded-[12px] p-8 shadow-sm">
                    <div className="w-14 h-14 bg-[#FEF2F2] text-[#DC2626] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#FCA5A5]">
                        <ShieldAlert size={28} />
                    </div>
                    <h1 className="text-2xl font-semibold text-[#102A28] mb-2">Access Denied</h1>
                    <p className="text-sm text-[#4B5F5C] mb-8 leading-relaxed">
                        You do not have permission to access the admin dashboard. This area is restricted to authorized personnel only.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => auth.signOut()}
                            className="btn-secondary"
                        >
                            Sign out
                        </button>
                        <a
                            href="/"
                            className="btn-primary"
                        >
                            Return home
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
