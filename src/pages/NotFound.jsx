import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import PageWrapper from '../components/public/PageWrapper';

const NotFound = () => {
    return (
        <PageWrapper className="min-h-screen bg-dark flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] pointer-events-none animate-pulse delay-700"></div>

            <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
                <h1 className="text-9xl font-black text-gradient animate-float">
                    404
                </h1>

                <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
                        Lost in Space?
                    </h2>
                    <p className="text-text-secondary text-lg">
                        The page you are looking for seems to have drifted into a black hole.
                        Let's get you back to safety.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                    <Link
                        to="/"
                        className="flex items-center justify-center gap-2 px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-full font-bold transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transform hover:-translate-y-1"
                    >
                        <Home size={20} />
                        Return Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center justify-center gap-2 px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-full font-bold transition-all border border-white/10"
                    >
                        <ArrowLeft size={20} />
                        Go Back
                    </button>
                </div>
            </div>

            {/* Decoratiive Stars */}
            <div className="absolute top-10 left-10 text-text-secondary/50 animate-spin-slow">✧</div>
            <div className="absolute bottom-20 right-20 text-text-secondary/50 text-4xl animate-bounce">⋆</div>
            <div className="absolute top-1/2 right-10 text-text-secondary/50 text-2xl">✦</div>
        </PageWrapper>
    );
};

export default NotFound;
