import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import IconArrowDown from "@components/common/icons/IconArrowDown";
import IconArrowUp from "@components/common/icons/IconArrowUp";
import OrderInfoRows, { OrderInfoRow } from "@components/order/order-info-rows/OrderInfoRows";
import { DcaOrderSummary } from "@models/order/order-summary";

import { DcaOrderDetailWrapper } from "./DcaOrderDetail.styles";

interface DcaOrderDetailProps {
  summary: DcaOrderSummary;
  defaultOpened?: boolean;
}

/** Collapsible rate and order details: Amount per Order, Estimated End Date, Execution Fee, Network Gas Fee. */
const DcaOrderDetail: React.FC<DcaOrderDetailProps> = ({ summary, defaultOpened = true }) => {
  const { t } = useTranslation();
  const [opened, setOpened] = useState(defaultOpened);

  const rows: OrderInfoRow[] = useMemo(
    () => [
      {
        key: "amountPerOrder",
        label: t("Swap:dca.amountPerOrder"),
        value: `${summary.amountPerOrder} ${summary.inputToken.displaySymbol}`,
      },
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
        <span>
          {summary.rate} <span className="rate-usd">({summary.rateUsd})</span>
        </span>
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
