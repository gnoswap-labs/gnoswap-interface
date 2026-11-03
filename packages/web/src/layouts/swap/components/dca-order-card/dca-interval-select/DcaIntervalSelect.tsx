import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { OrderInfoTooltip } from "@components/order/order-info-rows/OrderInfoRows";
import OrderSelectBox from "@components/order/order-select-box/OrderSelectBox";
import { DcaIntervalUnit } from "@models/order/dca-order-model";

import { OrderField } from "../../order-form/OrderForm.styles";

interface DcaIntervalSelectProps {
  interval: number;
  options: { unit: DcaIntervalUnit; interval: number }[];
  changeInterval: (interval: number) => void;
}

/** `Every`: one unit of the selected interval. Only the unit is chosen; the contract fixes the intervals. */
const DcaIntervalSelect: React.FC<DcaIntervalSelectProps> = ({ interval, options, changeInterval }) => {
  const { t } = useTranslation();

  const selectOptions = useMemo(
    () => options.map(option => ({ value: option.interval, label: t(`Swap:dca.unit.${option.unit}`) })),
    [options, t],
  );

  return (
    <OrderField>
      <span className="field-label">
        {t("Swap:dca.every")}
        <OrderInfoTooltip content={t("Swap:dca.everyTooltip")} />
      </span>
      <div className="field-value">
        <span className="field-text">1</span>
        <OrderSelectBox value={interval} options={selectOptions} onChange={changeInterval} />
      </div>
    </OrderField>
  );
};

export default DcaIntervalSelect;
