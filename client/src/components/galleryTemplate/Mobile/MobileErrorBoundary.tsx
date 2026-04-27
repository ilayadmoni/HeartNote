"use client";

import { Component, type ReactNode } from "react";

interface MobileErrorBoundaryProps {
  scope: string;
  fallback: (error: Error, reset: () => void) => ReactNode;
  children: ReactNode;
}

interface MobileErrorBoundaryState {
  error: Error | null;
}

export class MobileErrorBoundary extends Component<
  MobileErrorBoundaryProps,
  MobileErrorBoundaryState
> {
  state: MobileErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): MobileErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error) {
    if (process.env.NODE_ENV === "development") {
      console.error(`[MobileErrorBoundary:${this.props.scope}]`, error);
    }
  }

  reset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return this.props.fallback(this.state.error, this.reset);
    }
    return this.props.children;
  }
}
