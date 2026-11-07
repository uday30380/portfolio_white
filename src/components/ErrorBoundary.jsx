import React from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(_error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);

        // If error is due to stale deployment asset hashes, auto-refresh once
        const isChunkError = error && (
            error.message?.includes('Failed to fetch dynamically imported module') ||
            error.message?.includes('Importing a module script failed') ||
            error.name === 'ChunkLoadError'
        );

        if (isChunkError) {
            const lastAutoReload = Number(sessionStorage.getItem('chunk_error_auto_reload') || 0);
            if (Date.now() - lastAutoReload > 15000) {
                sessionStorage.setItem('chunk_error_auto_reload', String(Date.now()));
                window.location.reload();
            }
        }
    }

    handleReload = () => {
        sessionStorage.removeItem('chunk_error_auto_reload');
        sessionStorage.removeItem('page_has_been_refreshed');
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            const isChunkError = this.state.error && (
                this.state.error.message?.includes('Failed to fetch dynamically imported module') ||
                this.state.error.message?.includes('Importing a module script failed') ||
                this.state.error.name === 'ChunkLoadError'
            );

            return (
                <div className="min-h-screen bg-[#F7FAFA] flex flex-col items-center justify-center p-6 text-center text-[#102A28]">
                    <div className="p-8 bg-white border border-[#DDE7E5] rounded-[12px] shadow-sm max-w-lg w-full text-left">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-lg bg-[#FEF2F2] border border-[#FCA5A5]/40 text-[#DC2626] flex items-center justify-center shrink-0">
                                <AlertTriangle size={20} />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-[#102A28]">
                                    {isChunkError ? 'New update available' : 'Something went wrong'}
                                </h1>
                                <p className="text-xs text-[#8A9B98]">
                                    {isChunkError ? 'Asset refresh required' : 'Application error'}
                                </p>
                            </div>
                        </div>

                        <p className="text-sm text-[#4B5F5C] leading-relaxed mb-6">
                            {isChunkError
                                ? 'A new version of the site has been deployed. Reload to get the latest update.'
                                : 'An unexpected error occurred while loading this page. Reloading typically resolves it.'}
                        </p>

                        <button
                            type="button"
                            onClick={this.handleReload}
                            className="btn-primary w-full justify-center"
                        >
                            <RefreshCw size={16} />
                            <span>{isChunkError ? 'Update and reload' : 'Reload page'}</span>
                        </button>

                        {this.state.error && (
                            <details className="mt-6 text-left max-h-40 overflow-auto bg-[#EEF4F3] p-3 rounded-lg border border-[#DDE7E5] text-xs text-[#4B5F5C] font-mono">
                                <summary className="cursor-pointer font-medium mb-1 text-[#102A28]">Debug details</summary>
                                {this.state.error.toString()}
                                <br />
                                {this.state.errorInfo && this.state.errorInfo.componentStack}
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
