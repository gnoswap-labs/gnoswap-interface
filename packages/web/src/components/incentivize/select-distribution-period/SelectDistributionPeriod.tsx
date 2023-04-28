import React from "react";
import { CONTENT_TITLE } from "@components/incentivize/pool-incentivize/PoolIncentivize";
import { wrapper } from "./SelectDistributionPeriod.styles";

interface SelectDistributionPeriodProps {}

const SelectDistributionPeriod: React.FC<
  SelectDistributionPeriodProps
> = ({}) => {
  return (
    <div css={wrapper}>
      <h5 className="section-title">{CONTENT_TITLE.SELECT_PERIOD}</h5>
      <div className="select-date-wrap">
        <div className="start-date"></div>
        <div className="end-date"></div>
      </div>
    </div>
  );
};

export default SelectDistributionPeriod;
