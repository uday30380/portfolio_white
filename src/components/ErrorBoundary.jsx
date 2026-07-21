import React from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    // eslint-disable-next-line no-unused-vars
    static getDerivedStateFromError(_) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
                    <div className="p-8 bg-[#111111] border border-white/10 rounded-3xl shadow-2xl max-w-lg w-full relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-red-500/10 rounded-full text-red-500">
                                <AlertTriangle size={48} />
                            </div>
                        </div>

                        <h1 className="text-3xl font-black text-white mb-4">System Malfunction</h1>
                        <p className="text-gray-400 mb-8">
                            An unexpected error has occurred. Our systems have logged the issue.
                        </p>

                        <button
                            onClick={this.handleReload}
                            className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
                        >
                            <RefreshCw size={20} /> Reload System
                        </button>

                        {/* Developer Details - Hidden in Production usually, but useful here */}
                        <details className="mt-8 text-left max-h-48 overflow-auto bg-black/50 p-4 rounded-xl border border-white/5 text-xs text-red-400 font-mono">
                            <summary className="cursor-pointer font-bold mb-2 opacity-70 hover:opacity-100">Debug Information</summary>
                            {this.state.error && this.state.error.toString()}
                            <br />
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </details>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
