import React from "react";
import SelectDistributionPeriodInput from "../select-distribution-period-input/SelectDistributionPeriodInput";
import { SelectDistributionPeriodWrapper } from "./SelectDistributionPeriod.styles";
import SelectDistributionDateInput from "../select-distribution-date-input/SelectDistributionDateInput";

interface DistributionPeriodDate {
  year: number;
  month: number;
  date: number;
}

interface SelectDistributionPeriodProps {
  startDate?: DistributionPeriodDate,
  setStartDate: (date: DistributionPeriodDate) => void;
  period: number;
  periods: number[];
  setPeriod: (period: number) => void;
}

const SelectDistributionPeriod: React.FC<
  SelectDistributionPeriodProps
> = ({
  startDate,
  setStartDate,
  period,
  periods,
  setPeriod,
}) => {

    return (
      <SelectDistributionPeriodWrapper>
        <h5 className="section-title">2. Select Distribution Period</h5>
        <div className="select-date-wrap">
          <div className="start-date">
            <SelectDistributionDateInput
              title="Start Date"
              date={startDate}
              setDate={setStartDate}
            />
          </div>
          <div className="period">
            <SelectDistributionPeriodInput
              periods={periods}
              title="Distribution Period"
              period={period}
              changePeriod={setPeriod}
            />
          </div>
        </div>
      </SelectDistributionPeriodWrapper>
    );
  };

export default SelectDistributionPeriod;
