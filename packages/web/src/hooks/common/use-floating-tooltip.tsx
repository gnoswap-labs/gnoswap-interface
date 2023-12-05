import {
  arrow,
  getOverflowAncestors,
  shift,
  useFloating,
} from "@floating-ui/react";
import React, { useCallback, useEffect, useRef, useState } from "react";

type FloatingPlacement = "end" | "start";
type FloatingSide = "top" | "right" | "bottom" | "left";
export type FloatingPosition =
  | FloatingSide
  | `${FloatingSide}-${FloatingPlacement}`;
interface UseFloatingTooltip {
  offset: number;
  position: FloatingPosition;
}

export function useFloatingTooltip<T extends HTMLElement = any>({
  offset,
  position,
}: UseFloatingTooltip) {
  const [opened, setOpened] = useState(false);
  const boundaryRef = useRef<T>();
  const arrowRef = useRef(null);
  const { x, y, elements, context, refs, strategy, update, placement } =
    useFloating({
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

  const horizontalOffset = placement.includes("right")
    ? offset
    : position.includes("left")
    ? offset * -1
    : 0;

  const verticalOffset = placement.includes("bottom") || placement.includes("right") || placement.includes("left")
    ? offset + 32
    : position.includes("top")
    ? offset * -1
    : 0;
  
  const handleMouseMove = useCallback(
    ({ clientX, clientY }: MouseEvent | React.MouseEvent<T, MouseEvent>) => {
      console.log(clientX, clientY, verticalOffset, horizontalOffset);
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
    },
    [elements.reference],
  );

  useEffect(() => {
    if (refs.floating.current) {
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
  }, [
    elements.reference,
    refs.floating.current,
    update,
    handleMouseMove,
    opened,
  ]);

  return {
    handleMouseMove,
    x,
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
