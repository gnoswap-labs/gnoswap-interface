import { useTheme } from "@emotion/react";
import {
  arrow,
  autoUpdate,
  flip,
  FloatingArrow,
  FloatingPortal,
  offset,
  safePolygon,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useMergeRefs,
  useRole,
  type Placement
} from "@floating-ui/react";
import { useAtomValue } from "jotai";
import React, { CSSProperties, useCallback, useMemo, useRef, useState } from "react";

import { ThemeState } from "@states/index";
import { Z_INDEX } from "@styles/zIndex";

import { BaseTooltipWrapper, Content } from "./Tooltip.styles";

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
    enabled: true,
    handleClose: safePolygon({ buffer: -Infinity }),
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
  scroll?: boolean;
}

const Tooltip: React.FC<React.PropsWithChildren<TooltipProps>> = ({
  children,
  placement,
  FloatingContent,
  width,
  floatClassName,
  isShouldShowed = true,
  className,
  forcedOpen = false,
  scroll = false,
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

  const showScroll = useCallback((scrollContainer: HTMLElement | null) => {
    let timeout: NodeJS.Timeout;
    scrollContainer?.addEventListener("scroll", () => {
      scrollContainer.classList.add("show-scroll");

      clearTimeout(timeout);

      timeout = setTimeout(() => {
        scrollContainer.classList.remove("show-scroll");
      }, 1000);
    });
  }, []);


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
              <Content
                themeKey={themeKey}
                ref={ref => showScroll(ref)}
                className={`${scroll ? "use-scroll" : ""}`}
              >
                {FloatingContent}
              </Content>
            )}
          </div>
        )}
      </FloatingPortal>
    </>
  );
};

export default Tooltip;
