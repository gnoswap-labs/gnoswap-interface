import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import IconArrowDown from "@components/common/icons/IconArrowDown";
import IconArrowUp from "@components/common/icons/IconArrowUp";
import DcaOrderSentence from "@components/order/dca-order-sentence/DcaOrderSentence";
import OrderInfoRows, { OrderInfoRow } from "@components/order/order-info-rows/OrderInfoRows";
import { DcaOrderSummary } from "@models/order/order-summary";

import { DcaOrderDetailWrapper } from "./DcaOrderDetail.styles";

interface DcaOrderDetailProps {
  summary: DcaOrderSummary;
  defaultOpened?: boolean;
}

/** The order sentence and market price, with collapsible details: Estimated End Date, Execution Fee. */
const DcaOrderDetail: React.FC<DcaOrderDetailProps> = ({ summary, defaultOpened = true }) => {
  const { t } = useTranslation();
  const [opened, setOpened] = useState(defaultOpened);

  const rows: OrderInfoRow[] = useMemo(
    () => [
      { key: "estimatedEndDate", label: t("Swap:dca.estimatedEndDate"), value: summary.estimatedEndDate },
      {
        key: "executionFee",
        label: t("Swap:dca.executionFee"),
        tooltip: t("Swap:dca.executionFeeTooltip"),
        value: summary.executionFee,
      },
    ],
    [summary, t],
  );

  return (
    <DcaOrderDetailWrapper>
      <div className="detail-header" onClick={() => setOpened(prev => !prev)} role="button" aria-expanded={opened}>
        <DcaOrderSentence summary={summary} />
        <span className="gas-info">
          {opened ? <IconArrowUp className="icon-arrow" /> : <IconArrowDown className="icon-arrow" />}
        </span>
      </div>
      {opened && (
        <div className="detail-body">
          <OrderInfoRows rows={rows} />
        </div>
      )}
    </DcaOrderDetailWrapper>
  );
};

export default DcaOrderDetail;
