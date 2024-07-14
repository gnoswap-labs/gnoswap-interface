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
import { BaseTooltipWrapper, Content } from "./Tooltip.styles";
import { useTheme } from "@emotion/react";
import { Z_INDEX } from "@styles/zIndex";
import { useAtomValue } from "jotai";
import { ThemeState } from "@states/index";

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
  className?: string;
  isShouldShowed?: boolean;
  forcedOpen?: boolean;
}

const Tooltip: React.FC<React.PropsWithChildren<TooltipProps>> = ({
  children,
  placement,
  FloatingContent,
  width,
  floatClassName,
  isShouldShowed = true,
  className,
  forcedOpen,
}) => {
  const { open, refs, strategy, x, y, context, arrowRef } = useTooltip({
    placement,
  });
  const childrenRef = useMergeRefs([refs.setReference]);
  const floatingRef = useMergeRefs([refs.setFloating]);
  const themeKey = useAtomValue(ThemeState.themeKey);
  const theme = useTheme();

  const showFloat = useMemo(() => {
    return forcedOpen || (open && isShouldShowed);
  }, [forcedOpen, isShouldShowed, open]);

  return (
    <>
      <BaseTooltipWrapper
        ref={childrenRef}
        data-state={open && isShouldShowed ? "open" : "closed"}
        style={{
          display: "flex",
          width: width && width,
        }}
        className={`base-tooltip-wrapper ${className}`}
      >
        {children}
      </BaseTooltipWrapper>
      <FloatingPortal>
        {showFloat && (
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
            {FloatingContent && (
              <FloatingArrow
                ref={arrowRef}
                context={context}
                fill={theme.color.background02}
                width={20}
                height={14}
                tipRadius={4}
              />
            )}
            {FloatingContent && (
              <Content themeKey={themeKey}>{FloatingContent}</Content>
            )}
          </div>
        )}
      </FloatingPortal>
    </>
  );
};

export default Tooltip;
