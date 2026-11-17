import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import IconStrokeArrowDown from "@components/common/icons/IconStrokeArrowDown";
import IconStrokeArrowUp from "@components/common/icons/IconStrokeArrowUp";
import { ValueAnnotation } from "@components/order/common/OrderValueAnnotation.styles";
import DcaOrderSentence from "@components/order/dca-order-sentence/DcaOrderSentence";
import OrderInfoRows, { OrderInfoRow } from "@components/order/order-info-rows/OrderInfoRows";
import { useOrderClock } from "@hooks/order/ui/use-order-clock";
import { DcaOrderSummary } from "@models/order/order-summary";
import { formatOrderFullAmount, formatOrderTimeUntil } from "@utils/order-format-utils";

import { DcaOrderDetailWrapper, DcaOrderSentenceBox } from "./DcaOrderDetail.styles";

interface DcaOrderDetailProps {
  summary: DcaOrderSummary;
  defaultOpened?: boolean;
}

/**
 * The market rate as on the Swap card, with collapsible details (Estimated End Date, Execution Fee), followed by the
 * order sentence in its own box, as in the confirm modal.
 */
const DcaOrderDetail: React.FC<DcaOrderDetailProps> = ({ summary, defaultOpened = true }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const nowUnixSeconds = useOrderClock();
  const [opened, setOpened] = useState(defaultOpened);

  const rows: OrderInfoRow[] = useMemo(() => {
    const endsIn = formatOrderTimeUntil(summary.estimatedEndAt, locale, nowUnixSeconds);

    return [
      {
        key: "estimatedEndDate",
        label: t("Swap:dca.estimatedEndDate"),
        value: endsIn ? (
          <span>
            {summary.estimatedEndDate} <ValueAnnotation>({endsIn})</ValueAnnotation>
          </span>
        ) : (
          summary.estimatedEndDate
        ),
      },
      {
        key: "executionFee",
        label: `${t("Swap:dca.executionFee")} (${summary.executionFee})`,
        tooltip: t("Swap:dca.executionFeeTooltip"),
        value:
          summary.executionFeeAmount !== null ? (
            <span>
              {formatOrderFullAmount(summary.executionFeeAmount, summary.outputToken.decimals)}{" "}
              {summary.outputToken.displaySymbol}
              {summary.executionFeeUsd && " "}
              {summary.executionFeeUsd && <ValueAnnotation>({summary.executionFeeUsd})</ValueAnnotation>}
            </span>
          ) : (
            "-"
          ),
      },
    ];
  }, [locale, nowUnixSeconds, summary, t]);

  return (
    <>
      <DcaOrderDetailWrapper>
        <div className="detail-header" onClick={() => setOpened(prev => !prev)} role="button" aria-expanded={opened}>
          <span className="rate-info">
            <span className="rate">{summary.rate}</span>
            {summary.rateUsd !== "-" && <span className="rate-usd">(≈{summary.rateUsd})</span>}
          </span>
          {opened ? <IconStrokeArrowUp className="icon-arrow" /> : <IconStrokeArrowDown className="icon-arrow" />}
        </div>
        {opened && (
          <div className="detail-body">
            <OrderInfoRows rows={rows} />
          </div>
        )}
      </DcaOrderDetailWrapper>
      <DcaOrderSentenceBox>
        <DcaOrderSentence summary={summary} />
      </DcaOrderSentenceBox>
    </>
  );
};

export default DcaOrderDetail;
