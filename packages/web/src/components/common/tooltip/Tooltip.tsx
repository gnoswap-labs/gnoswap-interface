import React, { CSSProperties, useMemo, useRef, useState } from "react";
import {
  type Placement,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  useFloating,
  autoUpdate,
  offset,
  shift,
  useMergeRefs,
  FloatingArrow,
  arrow,
  flip,
} from "@floating-ui/react";
import { Content } from "./Tooltip.styles";
import { useTheme } from "@emotion/react";
import { Z_INDEX } from "@styles/zIndex";

function useTooltip({ placement }: { placement: Placement }) {
  const [open, setOpen] = useState(false);
  const arrowRef = useRef(null);

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(20),
      flip({
        fallbackAxisSideDirection: "start",
      }),
      shift(),
      arrow({
        element: arrowRef,
      }),
    ],
  });

  const context = data.context;

  const hover = useHover(context, {
    move: false,
    enabled: true,
  });
  const focus = useFocus(context, {
    enabled: true,
  });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });

  const interactions = useInteractions([hover, focus, dismiss, role]);

  return useMemo(
    () => ({
      open,
      setOpen,
      arrowRef,
      ...interactions,
      ...data,
    }),
    [open, setOpen, interactions, data],
  );
}
interface TooltipProps {
  placement: Placement;
  FloatingContent: React.ReactNode;
  width?: CSSProperties["width"];
  floatClassName?: string;
}

const Tooltip: React.FC<React.PropsWithChildren<TooltipProps>> = ({
  children,
  placement,
  FloatingContent,
  width,
  floatClassName,
}) => {
  const { open, refs, strategy, x, y, context, arrowRef } = useTooltip({
    placement,
  });
  const childrenRef = useMergeRefs([refs.setReference]);
  const floatingRef = useMergeRefs([refs.setFloating]);

  const theme = useTheme();

  return (
    <>
      <div
        ref={childrenRef}
        data-state={open ? "open" : "closed"}
        style={{
          display: "flex",
          width: width && width,
        }}
      >
        {children}
      </div>
      <FloatingPortal>
        {open && (
          <div
            ref={floatingRef}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              visibility: x == null ? "hidden" : "visible",
              zIndex: Z_INDEX.modalTooltip,
            }}
            className={floatClassName}
          >
            <FloatingArrow
              ref={arrowRef}
              context={context}
              fill={theme.color.background14}
              width={20}
              height={14}
              tipRadius={4}
            />
            <Content>{FloatingContent}</Content>
          </div>
        )}
      </FloatingPortal>
    </>
  );
};

export default Tooltip;
