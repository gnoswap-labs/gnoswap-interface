import { FloatingArrow, FloatingPortal } from "@floating-ui/react";
import type { ElementRef } from "react";
import React, {
  cloneElement,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
} from "react";

import { useTheme } from "@emotion/react";
import {
  FloatingPosition,
  useFloatingTooltip,
} from "@hooks/common/use-floating-tooltip";
import { useMergedRef } from "@hooks/common/use-merged-ref";
import { useWindowSize } from "@hooks/common/use-window-size";
import { DEVICE_TYPE } from "@styles/media";
import { Z_INDEX } from "@styles/zIndex";
import { FloatContent } from "./Tooltip.styles";

interface TooltipProps {
  offset?: number;
  position: FloatingPosition;
  content: React.ReactNode | null;
  className?: string;
  isHiddenArrow?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: any;
  enabled?: boolean;
}

const FloatingTooltip = forwardRef<ElementRef<"div">, TooltipProps>(
  (
    {
      children,
      content,
      className,
      isHiddenArrow,
      position = "top" as FloatingPosition,
      offset = 20,
    },
    ref,
  ) => {
    const tooltipRef = useRef<HTMLDivElement>(null);
    const { breakpoint, width } = useWindowSize();
    const padding = width <= 768 && width >= 360 ? 16 : 0;
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
      offset: offset,
      position: position,
      tooltipWidth: Math.max(
        0,
        width - (tooltipRef?.current?.offsetWidth || 0) - padding,
      ),
    });
    const theme = useTheme();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const targetRef = useMergedRef(boundaryRef, (children as any).ref, ref);

    const onMouseEnter = (
      event: React.MouseEvent<unknown, MouseEvent> | React.TouchEvent<unknown>,
    ) => {
      children.props.onMouseEnter?.(event);
      handleMouseMove(event);
      setOpened(true);
    };

    const onMouseLeave = (event: React.MouseEvent<unknown, MouseEvent>) => {
      children.props.onMouseLeave?.(event);
      setOpened(false);
    };

    const onTouchStart = (event: React.TouchEvent<unknown>) => {
      children.props.onPointerEnter?.(event);
      handleMouseMove(event);
      setOpened(true);
    };

    useEffect(() => {
      const handleScroll = () => {
        if (breakpoint !== DEVICE_TYPE.WEB) {
          setOpened(false);
        }
      };
      document.addEventListener("scroll", handleScroll);
      return () => {
        document.removeEventListener("scroll", handleScroll);
      };
    }, [breakpoint]);

    const isDisplay = useMemo(() => {
      return content !== null;
    }, [content]);

    const floatPosition = useMemo(() => {
      return {
        top: y || "",
        left: x || "",
      };
    }, [x, y]);

    return (
      <>
        {cloneElement(children, {
          ...children.props,
          ref: targetRef,
          onMouseEnter,
          onMouseLeave,
          onTouchStart: onTouchStart,
          onTouchMove: onTouchStart,
        })}
        <FloatingPortal>
          <div
            ref={floating}
            style={{
              position: strategy,
              display: isDisplay && opened ? "block" : "none",
              zIndex: Z_INDEX.modalTooltip,
              pointerEvents: "none",
              ...floatPosition,
            }}
            className={className}
            onTouchMove={onTouchStart}
            onTouchStart={onTouchStart}
          >
            {!isHiddenArrow && (
              <FloatingArrow
                ref={arrowRef}
                context={context}
                fill={theme.color.background14}
                width={20}
                height={14}
                tipRadius={4}
              />
            )}
            {content && <FloatContent ref={tooltipRef}>{content}</FloatContent>}
          </div>
        </FloatingPortal>
      </>
    );
  },
);

FloatingTooltip.displayName = "FloatingTooltip";

export default FloatingTooltip;
