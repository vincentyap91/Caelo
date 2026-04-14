import React from 'react';

/**
 * Top-level React Error Boundary.
 * Catches any unhandled render / lifecycle errors in the tree below it and
 * renders a safe fallback instead of a blank white page.
 *
 * Usage: wrap <App /> in main.jsx with <ErrorBoundary />.
 */
export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        // Log to console so Vercel logs (and browser DevTools) capture it.
        console.error('[ErrorBoundary] Uncaught render error:', error);
        console.error('[ErrorBoundary] Component stack:', info?.componentStack ?? '(unavailable)');
    }

    handleReload() {
        // Hard reload clears any stale state that caused the crash.
        try {
            window.location.reload();
        } catch {
            // If window is somehow unavailable, navigate to root.
            window.location.href = '/';
        }
    }

    handleGoHome() {
        try {
            window.location.href = '/';
        } catch {
            /* ignore */
        }
    }

    render() {
        if (!this.state.hasError) {
            return this.props.children;
        }

        return (
            <div
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    fontFamily: 'Poppins, system-ui, sans-serif',
                    background: 'linear-gradient(160deg, #f0f5ff 0%, #e8f0fe 100%)',
                }}
            >
                <div
                    style={{
                        maxWidth: '420px',
                        width: '100%',
                        background: '#fff',
                        borderRadius: '1.25rem',
                        boxShadow: '0 8px 32px rgba(15,23,42,0.10)',
                        border: '1px solid #e2e8f0',
                        padding: '2.5rem 2rem',
                        textAlign: 'center',
                    }}
                >
                    {/* Icon */}
                    <div
                        style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.25rem',
                            fontSize: '1.75rem',
                        }}
                        aria-hidden="true"
                    >
                        ⚠️
                    </div>

                    <h1
                        style={{
                            fontSize: '1.125rem',
                            fontWeight: '700',
                            color: '#0f172a',
                            marginBottom: '0.5rem',
                        }}
                    >
                        Something went wrong
                    </h1>

                    <p
                        style={{
                            fontSize: '0.875rem',
                            color: '#64748b',
                            lineHeight: '1.6',
                            marginBottom: '1.75rem',
                        }}
                    >
                        An unexpected error occurred. Please try reloading or go back to the home page.
                    </p>

                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                            type="button"
                            onClick={() => this.handleGoHome()}
                            style={{
                                flex: '1',
                                minWidth: '120px',
                                padding: '0.75rem 1.25rem',
                                borderRadius: '0.75rem',
                                border: '1px solid #cbd5e1',
                                background: '#f8fafc',
                                color: '#334155',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                            }}
                        >
                            Go to Home
                        </button>
                        <button
                            type="button"
                            onClick={() => this.handleReload()}
                            style={{
                                flex: '1',
                                minWidth: '120px',
                                padding: '0.75rem 1.25rem',
                                borderRadius: '0.75rem',
                                border: 'none',
                                background: 'linear-gradient(180deg, #1d4ed8 0%, #1e40af 100%)',
                                color: '#fff',
                                fontSize: '0.875rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                            }}
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
