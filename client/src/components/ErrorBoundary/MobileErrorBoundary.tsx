"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  scope: string;
  fallback?: (error: Error, reset: () => void) => ReactNode;
  children: ReactNode;
}

interface State {
  error: Error | null;
  componentStack: string | null;
}

/**
 * MobileErrorBoundary — catches render-tree exceptions and renders the
 * error message + stack ON SCREEN. Critical on iOS where we cannot
 * easily attach DevTools to a physical device.
 *
 * If a `fallback` prop is provided, callers can override the default UI;
 * otherwise the boundary renders a debug-friendly view that exposes
 * `error.message`, `error.stack`, and the React component stack.
 */
export class MobileErrorBoundary extends Component<Props, State> {
  state: State = { error: null, componentStack: null };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({ componentStack: info?.componentStack ?? null });
    // Forwarded to OnScreenErrorLog through the console.error hook.
    // eslint-disable-next-line no-console
    console.error(
      `[MOBILE-DEBUG] ${this.props.scope} crashed:`,
      error?.message,
      error?.stack,
      info?.componentStack,
    );
  }

  reset = () => this.setState({ error: null, componentStack: null });

  render() {
    const { error, componentStack } = this.state;
    if (!error) return this.props.children;
    if (this.props.fallback) return this.props.fallback(error, this.reset);

    return (
      <div
        role="alert"
        className="min-h-dvh flex flex-col items-stretch justify-start gap-3 p-4 text-left"
        style={{ background: "#faf3ec", direction: "ltr", fontFamily: "monospace" }}
      >
        <h2 className="text-lg font-bold text-red-700">
          [MOBILE-DEBUG] {this.props.scope} crashed
        </h2>
        <div className="text-sm text-stone-900">
          <strong>message:</strong>
          <pre className="whitespace-pre-wrap break-all bg-white/60 p-2 rounded mt-1">
            {error.message || "(no message)"}
          </pre>
        </div>
        {error.stack && (
          <div className="text-xs text-stone-800">
            <strong>stack:</strong>
            <pre className="whitespace-pre-wrap break-all bg-white/60 p-2 rounded mt-1 max-h-64 overflow-auto">
              {error.stack}
            </pre>
          </div>
        )}
        {componentStack && (
          <div className="text-xs text-stone-800">
            <strong>component stack:</strong>
            <pre className="whitespace-pre-wrap break-all bg-white/60 p-2 rounded mt-1 max-h-48 overflow-auto">
              {componentStack}
            </pre>
          </div>
        )}
        <button
          onClick={() => window.location.reload()}
          className="self-start px-5 py-2 rounded-full bg-stone-800 text-white font-bold mt-2"
        >
          Reload
        </button>
      </div>
    );
  }
}
