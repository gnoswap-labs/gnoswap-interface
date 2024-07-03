import { Component, ReactNode } from "react";
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

  componentDidCatch() {
    this.setState({ hasError: true });
  }

  componentDidUpdate(): void {
    if (this.state.hasError) {
      this.props.router.push("/500");
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return;
    }

    return this.props.children;
  }
}

export default withRouter(ErrorBoundary);
