import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

import { AppButton } from "@/components/common/AppButton";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  error: Error | null;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <div className="flex min-h-[60dvh] flex-col items-center justify-center gap-6 bg-background p-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <span className="text-4xl">🍅</span>
          <h2 className="text-xl font-bold text-foreground">哎呀，页面出了点问题</h2>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            别担心，你的数据不会丢失。请尝试刷新页面，如果问题持续，请联系开发者。
          </p>
        </div>
        <div className="flex gap-3">
          <AppButton onClick={() => this.setState({ error: null })} variant="secondary">
            重试
          </AppButton>
          <AppButton onClick={() => window.location.reload()} variant="primary">
            刷新页面
          </AppButton>
        </div>
        {import.meta.env.DEV && (
          <details className="mt-4 max-w-lg text-left">
            <summary className="cursor-pointer text-xs text-muted-foreground">错误详情</summary>
            <pre className="mt-2 max-h-40 overflow-auto rounded-lg bg-muted p-3 text-xs text-destructive">
              {this.state.error.message}
              {"\n"}
              {this.state.error.stack}
            </pre>
          </details>
        )}
      </div>
    );
  }
}
