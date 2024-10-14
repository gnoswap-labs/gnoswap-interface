import React from "react";
import { useTranslation } from "react-i18next";

import { DistributionPeriodDate } from "@states/earn";

import SelectDistributionDateInput from "./select-distribution-date-input/SelectDistributionDateInput";
import SelectDistributionPeriodInput from "./select-distribution-period-input/SelectDistributionPeriodInput";

import { SelectDistributionPeriodWrapper } from "./SelectDistributionPeriod.styles";

interface SelectDistributionPeriodProps {
  startDate?: DistributionPeriodDate;
  setStartDate: (date: DistributionPeriodDate) => void;
  period: number;
  periods: number[];
  setPeriod: (period: number) => void;
}

const SelectDistributionPeriod: React.FC<SelectDistributionPeriodProps> = ({
  startDate,
  setStartDate,
  period,
  periods,
  setPeriod,
}) => {
  const { t } = useTranslation();

  return (
    <SelectDistributionPeriodWrapper>
      <h5 className="section-title">
        {t("IncentivizePool:incentiPool.form.period.label")}
      </h5>
      <div className="select-date-wrap">
        <div className="start-date">
          <SelectDistributionDateInput
            title={t(
              "IncentivizePool:incentiPool.form.period.field.startDate.label",
            )}
            date={startDate}
            setDate={setStartDate}
          />
        </div>
        <div className="period">
          <SelectDistributionPeriodInput
            periods={periods}
            title={t("IncentivizePool:incenDetail.row.label.period")}
            period={period}
            changePeriod={setPeriod}
          />
        </div>
      </div>
    </SelectDistributionPeriodWrapper>
  );
};

export default SelectDistributionPeriod;
