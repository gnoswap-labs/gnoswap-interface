import React from "react";
import { CONTENT_TITLE } from "@components/incentivize/pool-incentivize/PoolIncentivize";
import { wrapper } from "./SelectDistributionPeriod.styles";
import SelectDistributionPeriodInput from "../select-distribution-period-input/SelectDistributionPeriodInput";

interface DistributionPeriodDate {
  year: number;
  month: number;
  date: number;
}

interface SelectDistributionPeriodProps {
  startDate?: DistributionPeriodDate,
  setStartDate: (date: DistributionPeriodDate) => void;
  endDate?: DistributionPeriodDate
  setEndDate: (date: DistributionPeriodDate) => void;
}

const SelectDistributionPeriod: React.FC<
  SelectDistributionPeriodProps
> = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
    return (
      <div css={wrapper}>
        <h5 className="section-title">{CONTENT_TITLE.SELECT_PERIOD}</h5>
        <div className="select-date-wrap">
          <div className="start-date">
            <SelectDistributionPeriodInput
              title="Start Date"
              date={startDate}
              setDate={setStartDate}
            />
          </div>
          <div className="end-date">
            <SelectDistributionPeriodInput
              title="End Date"
              date={endDate}
              setDate={setEndDate}
            />
          </div>
        </div>
      </div>
    );
  };

export default SelectDistributionPeriod;
