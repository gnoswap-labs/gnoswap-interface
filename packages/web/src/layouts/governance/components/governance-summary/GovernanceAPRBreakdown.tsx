import { useTheme } from "@emotion/react";
import {
  arrow,
  autoUpdate,
  flip,
  FloatingArrow,
  FloatingFocusManager,
  FloatingPortal,
  offset,
  safePolygon,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { useAtomValue } from "jotai";
import React, { useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Content as FloatingContent } from "@components/common/tooltip/Tooltip.styles";
import { formatXgnsApr, useXgnsAprCopy } from "@layouts/governance/xgns-apr/xgns-apr";
import type { GovernanceAPRHistory as APRHistoryDay } from "@repositories/governance";
import { ThemeState } from "@states/index";
import { Z_INDEX } from "@styles/zIndex";

import GovernanceAPRHistory from "./GovernanceAPRHistory";
import { GovernanceAPRBreakdownWrapper, GovernanceAPRHistoryPanel } from "./GovernanceAPRBreakdown.styles";
import GovernanceAPRValue from "./GovernanceAPRValue";

export interface GovernanceAPRBreakdownProps {
  /** Estimated total xGNS APR (`apy` from the summary API). */
  totalApr: string;
  /** Protocol fee APR, 7D average. Missing renders an em dash; never derived from the total. */
  protocolFeeApr?: string;
  /** GNS emission APR, 7D average. Missing renders an em dash. */
  emissionApr?: string;
  /** Daily total APR rows and reward components; history is offered only when rows exist. */
  aprHistory?: APRHistoryDay[];
  /** Overrides the active i18n language (isolated previews without an i18n instance). */
  language?: string;
}

const GovernanceAPRBreakdown: React.FC<GovernanceAPRBreakdownProps> = ({
  totalApr,
  protocolFeeApr,
  emissionApr,
  aprHistory,
  language,
}) => {
  const { i18n } = useTranslation();
  const tApr = useXgnsAprCopy(language);
  const theme = useTheme();
  const themeKey = useAtomValue(ThemeState.themeKey);

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const arrowRef = useRef(null);
  const historyTitleId = useId();
  const historyPanelId = useId();

  const { refs, strategy, x, y, context } = useFloating({
    open: isHistoryOpen,
    onOpenChange: setIsHistoryOpen,
    placement: "bottom-start",
    whileElementsMounted: autoUpdate,
    middleware: [offset(14), flip({ padding: 8 }), shift({ padding: 8 }), arrow({ element: arrowRef })],
  });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context, { move: false, handleClose: safePolygon() }),
    useFocus(context),
    useClick(context),
    useDismiss(context),
    useRole(context, { role: "dialog" }),
  ]);

  const unavailableLabel = tApr("unavailable");
  const hasHistory = (aprHistory?.length ?? 0) > 0;

  const components = [
    {
      key: "protocolFees",
      label: tApr("fees"),
      period: tApr("periodShort"),
      value: protocolFeeApr,
    },
    { key: "emission", label: tApr("emissionShort"), period: tApr("periodShort"), value: emissionApr },
  ] as const;

  return (
    <GovernanceAPRBreakdownWrapper className="apr-breakdown">
      <span className="apr-total">
        {hasHistory ? (
          <button
            type="button"
            className="apr-history-trigger"
            ref={refs.setReference}
            aria-label={tApr("history")}
            aria-expanded={isHistoryOpen}
            aria-controls={isHistoryOpen ? historyPanelId : undefined}
            {...getReferenceProps()}
          >
            <GovernanceAPRValue value={formatXgnsApr(totalApr)} unavailableLabel={unavailableLabel} />
          </button>
        ) : (
          <GovernanceAPRValue value={formatXgnsApr(totalApr)} unavailableLabel={unavailableLabel} />
        )}
      </span>
      <dl className="apr-components">
        {components.map(({ key, label, period, value }) => (
          <div className="apr-component" key={key}>
            <dt>
              <span className="apr-component-label">{label}</span>
              <span className="apr-component-period">({period})</span>
            </dt>
            <dd>
              <GovernanceAPRValue value={formatXgnsApr(value)} unavailableLabel={unavailableLabel} />
            </dd>
          </div>
        ))}
      </dl>
      {hasHistory && aprHistory && (
        <>
          {isHistoryOpen && (
            <FloatingPortal>
              <FloatingFocusManager context={context} modal={false} initialFocus={-1}>
                <div
                  ref={refs.setFloating}
                  id={historyPanelId}
                  aria-labelledby={historyTitleId}
                  style={{
                    position: strategy,
                    top: y ?? 0,
                    left: x ?? 0,
                    visibility: x == null ? "hidden" : "visible",
                    zIndex: Z_INDEX.modalTooltip,
                  }}
                  {...getFloatingProps()}
                >
                  <FloatingArrow
                    ref={arrowRef}
                    context={context}
                    fill={theme.color.background02}
                    width={20}
                    height={14}
                    tipRadius={4}
                  />
                  <FloatingContent themeKey={themeKey}>
                    <GovernanceAPRHistoryPanel>
                      <h3 id={historyTitleId}>{tApr("title")}</h3>
                      <GovernanceAPRHistory
                        days={aprHistory}
                        dateLabel={tApr("date")}
                        dailyAprLabel={tApr("dailyApr")}
                        feeLabel={tApr("fees")}
                        emissionLabel={tApr("emissionShort")}
                        unavailableLabel={unavailableLabel}
                        locale={language ?? (i18n?.language || "en")}
                      />
                      <p className="apr-disclosure">{tApr("disclosure")}</p>
                    </GovernanceAPRHistoryPanel>
                  </FloatingContent>
                </div>
              </FloatingFocusManager>
            </FloatingPortal>
          )}
        </>
      )}
    </GovernanceAPRBreakdownWrapper>
  );
};

export default GovernanceAPRBreakdown;
