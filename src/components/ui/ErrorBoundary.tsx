
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
    public declare readonly props: Props;
    public state: State;

    public constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false
        };
    }

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Unibelands 3D System Error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="w-full h-full flex flex-col items-center justify-center bg-black/80 border border-red-900/50 rounded-lg p-4">
                    <div className="text-red-500 font-mono text-xs tracking-widest mb-2">SYSTEM FAILURE</div>
                    <div className="w-8 h-8 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin"/>
                    <span className="text-[10px] text-red-400/60 mt-2 font-mono">RENDER_CONTEXT_LOST</span>
                </div>
            );
        }

        return this.props.children;
    }
}
