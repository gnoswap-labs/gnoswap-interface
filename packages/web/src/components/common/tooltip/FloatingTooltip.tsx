import { FloatingPortal, FloatingArrow } from "@floating-ui/react";

import type { ElementRef } from "react";
import React, { cloneElement, forwardRef } from "react";

import { useMergedRef } from "@hooks/common/use-merged-ref";
import {
  FloatingPosition,
  useFloatingTooltip,
} from "@hooks/common/use-floating-tooltip";
import { Content } from "./Tooltip.styles";
import { Z_INDEX } from "@styles/zIndex";
import { useTheme } from "@emotion/react";

interface TooltipProps {
  offset?: number;
  position: FloatingPosition;
  content: React.ReactNode;
  className?: string;
  children?: any;
}

const FloatingTooltip = forwardRef<ElementRef<"div">, TooltipProps>(
  ({ children, content, className }, ref) => {
    const {
      handleMouseMove,
      x,
      y,
      arrowRef,
      context,
      opened,
      boundaryRef,
      strategy,
      floating,
      setOpened,
    } = useFloatingTooltip({
      offset: 20,
      position: "top",
    });
    const theme = useTheme();

    const targetRef = useMergedRef(boundaryRef, (children as any).ref, ref);

    const onMouseEnter = (event: React.MouseEvent<unknown, MouseEvent>) => {
      children.props.onMouseEnter?.(event);
      handleMouseMove(event);
      setOpened(true);
    };

    const onMouseLeave = (event: React.MouseEvent<unknown, MouseEvent>) => {
      children.props.onMouseLeave?.(event);
      setOpened(false);
    };

    return (
      <>
        {cloneElement(children, {
          ...children.props,
          ref: targetRef,
          onMouseEnter,
          onMouseLeave,
        })}

        <FloatingPortal>
          <div
            ref={floating}
            style={{
              position: strategy,
              display: opened ? "block" : "none",
              top: (y && Math.round(y)) ?? "",
              left: (x && Math.round(x)) ?? "",
              zIndex: Z_INDEX.modalTooltip,
            }}
            className={className}
          >
            <FloatingArrow
              ref={arrowRef}
              context={context}
              fill={theme.color.background14}
              width={20}
              height={14}
              tipRadius={4}
            />
            <Content>{content}</Content>
          </div>
        </FloatingPortal>
      </>
    );
  },
);

FloatingTooltip.displayName = "FloatingTooltip";

export default FloatingTooltip;
