import { Component, ReactNode } from "react";
import { NextRouter, withRouter } from "next/router";

interface WithRouterProps {
  router: NextRouter;
}

interface ErrorBoundaryProps extends WithRouterProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.props.router.events.on("beforeHistoryChange", () => {
      this.setState({ hasError: false });
    });
    this.state = { hasError: false };
  }

  componentDidCatch() {
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
    }

    return this.props.children;
  }
}

export default withRouter<ErrorBoundaryProps>(ErrorBoundary);
