import React from "react";
import { useTranslation } from "react-i18next";

import OrderSelectBox, { OrderSelectOption } from "@components/order/order-select-box/OrderSelectBox";

import { OrderField } from "../../order-form/OrderForm.styles";

interface LimitExpirySelectProps {
  expiry: number;
  options: OrderSelectOption<number>[];
  changeExpiry: (duration: number) => void;
}

/** How long the order stays open. Options outside the configured duration range are hidden. */
const LimitExpirySelect: React.FC<LimitExpirySelectProps> = ({ expiry, options, changeExpiry }) => {
  const { t } = useTranslation();

  return (
    <OrderField className="centered">
      <span className="field-label">{t("Swap:limit.expiry")}</span>
      <OrderSelectBox value={expiry} options={options} onChange={changeExpiry} />
    </OrderField>
  );
};

export default LimitExpirySelect;
