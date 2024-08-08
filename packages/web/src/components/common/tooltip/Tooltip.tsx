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
  type Placement,
} from "@floating-ui/react";
import { useAtomValue } from "jotai";
import React, {
  CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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
  forcedOpen?: boolean;
  forcedClose?: boolean;
  scroll?: boolean;
  onChangeOpen?: (open: boolean) => void;
}

const Tooltip: React.FC<React.PropsWithChildren<TooltipProps>> = ({
  children,
  placement,
  FloatingContent,
  width,
  floatClassName,
  className,
  forcedOpen = false,
  forcedClose = false,
  scroll = false,
  onChangeOpen = undefined
}) => {
  const theme = useTheme();
  const themeKey = useAtomValue(ThemeState.themeKey);
  const { open, refs, strategy, x, y, context, arrowRef } = useTooltip({
    placement,
  });
  const childrenRef = useMergeRefs([refs.setReference]);
  const floatingRef = useMergeRefs([refs.setFloating]);
  const contentRef = useRef<HTMLDivElement>(null);

  const showTooltip = forcedOpen || (open && !forcedClose);
  const showTooltipRef = useRef(showTooltip);

  // trigger callback
  useEffect(() => {
    if (onChangeOpen && showTooltipRef.current !== showTooltip) {
      showTooltipRef.current = showTooltip;
      onChangeOpen(showTooltip);
    }
  }, [onChangeOpen, showTooltip]);

  // handle listner
  useEffect(() => {

    // disable auto hide scrollbar
    // let timeout: NodeJS.Timeout;
    // function showScrollEventListener(this: HTMLElement) {
    //   this.classList.add("show-scroll");
    //   clearTimeout(timeout);
    //   timeout = setTimeout(() => {
    //     this.classList.remove("show-scroll");
    //   }, 1000);
    // }

    function lockScroll() {
      document.body.style.overflow = "hidden";
    }

    function unlockScroll() {
      document.body.style.overflow = "";
    }

    const scrollContainer = contentRef.current;

    if (scrollContainer) {
      // scrollContainer.addEventListener("scroll", showScrollEventListener);
      scrollContainer.addEventListener("mouseover", lockScroll);
      scrollContainer.addEventListener("mouseout", unlockScroll);
    }

    return () => {
      if (scrollContainer) {
        // scrollContainer.removeEventListener("scroll", showScrollEventListener);
        scrollContainer.removeEventListener("mouseover", lockScroll);
        scrollContainer.removeEventListener("mouseout", unlockScroll);
      }
    };
  }, [showTooltip]);

  return (
    <>
      <BaseTooltipWrapper
        ref={childrenRef}
        data-state={open && forcedClose ? "open" : "closed"}
        style={{
          display: "flex",
          width: width && width,
        }}
        className={`base-tooltip-wrapper ${className}`}
      >
        {children}
      </BaseTooltipWrapper>
      <FloatingPortal>
        {showTooltip && (
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
              fill={theme.color.background02}
              width={20}
              height={14}
              tipRadius={4}
            />
            <Content
              themeKey={themeKey}
              ref={contentRef}
              className={`${scroll ? "use-scroll show-scroll" : ""}`}
            >
              {FloatingContent}
            </Content>
          </div>
        )}
      </FloatingPortal>
    </>
  );
};

export default Tooltip;
