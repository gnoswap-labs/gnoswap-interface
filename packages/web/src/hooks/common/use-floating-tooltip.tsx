import {
  arrow,
  getOverflowAncestors,
  shift,
  useFloating,
} from "@floating-ui/react";
import React, { useEffect, useMemo, useRef, useState } from "react";

type FloatingPlacement = "end" | "start";
type FloatingSide = "top" | "right" | "bottom" | "left";
export type FloatingPosition =
  | FloatingSide
  | `${FloatingSide}-${FloatingPlacement}`;
interface UseFloatingTooltip {
  offset: number;
  position: FloatingPosition;
  tooltipWidth?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useFloatingTooltip<T extends HTMLElement = any>({
  offset,
  position,
  tooltipWidth,
}: UseFloatingTooltip) {
  const [opened, setOpened] = useState(false);
  const boundaryRef = useRef<T>();
  const arrowRef = useRef(null);
  const { x, y, context, refs, strategy, update, placement } = useFloating({
    placement: position,
    middleware: [
      shift({
        crossAxis: true,
        padding: 5,
        rootBoundary: "document",
      }),
      arrow({
        element: arrowRef,
      }),
    ],
  });

  const isDisplay = useMemo(() => {
    return !!refs.reference && refs.floating?.current && boundaryRef?.current;
  }, [refs.reference, refs.floating?.current, boundaryRef.current]);

  const horizontalOffset = placement.includes("right")
    ? offset
    : position.includes("left")
    ? offset * -1
    : position.includes("top-start")
    ? offset
    : position.includes("top-end")
    ? -offset
    : 0;

  const verticalOffset =
    placement.includes("bottom") ||
    placement.includes("right") ||
    placement.includes("left")
      ? offset + 32
      : position.includes("top")
      ? offset * -1
      : 0;

  const handleMouseMove = (
    event: MouseEvent | React.MouseEvent<T, MouseEvent> | React.TouchEvent<T>,
  ) => {
    const isTouch = event.type.startsWith("touch");
    const touch = isTouch ? (event as React.TouchEvent<T>).touches[0] : null;
    const clientX =
      (isTouch
        ? touch?.clientX
        : (event as React.MouseEvent<T, MouseEvent>).clientX) || 0;
    const clientY =
      (isTouch
        ? touch?.clientY
        : (event as React.MouseEvent<T, MouseEvent>).clientY) || 0;

    refs.setPositionReference({
      getBoundingClientRect() {
        return {
          width: 0,
          height: 0,
          x: clientX,
          y: clientY,
          left: clientX + horizontalOffset,
          top: clientY + verticalOffset,
          right: clientX,
          bottom: clientY,
        };
      },
    });
  };

  useEffect(() => {
    console.log(boundaryRef.current);
    if (isDisplay && refs.floating.current && boundaryRef.current) {
      const boundary = boundaryRef.current!;
      boundary.addEventListener("mousemove", handleMouseMove);

      const parents = getOverflowAncestors(refs.floating.current);
      parents.forEach(parent => {
        parent.addEventListener("scroll", update);
      });

      return () => {
        boundary.removeEventListener("mousemove", handleMouseMove);
        parents.forEach(parent => {
          parent.removeEventListener("scroll", update);
        });
      };
    }

    return undefined;
  }, [isDisplay, boundaryRef.current]);

  return {
    handleMouseMove,
    x: Math.min(tooltipWidth || 0, x || 0),
    y,
    arrowRef,
    context,
    strategy,
    opened,
    setOpened,
    boundaryRef,
    floating: refs.setFloating,
  };
}
