import React from "react";
import { GridWrapper } from "./HorizontalScrollWrapper.styles";

interface HorizontalScrollWrapperProps {
  children: React.ReactNode;
  loading: boolean;
  onScroll?: () => void;
  className?: string;
}

export const HorizontalScrollWrapper = React.forwardRef<HTMLDivElement, HorizontalScrollWrapperProps>(
  ({ children, loading, onScroll, ...props }, ref) => {
    return (
      <GridWrapper $loading={loading} onScroll={onScroll} ref={ref} {...props}>
        {children}
      </GridWrapper>
    );
  },
);

HorizontalScrollWrapper.displayName = "HorizontalScrollWrapper";
