import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-900 text-white p-10 flex flex-col items-center justify-center">
                    <h1 className="text-3xl font-bold text-red-500 mb-4">Something went wrong 😵</h1>
                    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 max-w-2xl w-full overflow-auto">
                        <h2 className="text-xl font-mono text-yellow-400 mb-2">{this.state.error && this.state.error.toString()}</h2>
                        <details className="whitespace-pre-wrap font-mono text-xs text-slate-400">
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </details>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-500 transition"
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
