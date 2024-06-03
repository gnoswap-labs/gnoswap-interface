import { Component, ErrorInfo, ReactNode } from "react";
import { NextRouter, withRouter } from "next/router";

interface ErrorBoundaryProps {
  router: NextRouter;

  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ hasError: true });

    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      this.props.router.push("/500");
      return;
    }

    return this.props.children;
  }
}

export default withRouter(ErrorBoundary);
