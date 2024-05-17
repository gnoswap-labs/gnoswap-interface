import React from "react";
import Range from "@components/common/range/Range";
import { DecreaseSelectPositionWrapper } from "./DecreaseSelectPosition.styles";
import DecreasePoolInfoLoading from "../decrease-pool-info/DecreasePoolInfoLoading";

const DecreaseAmountPositionLoading: React.FC = () => {
  return (
    <DecreaseSelectPositionWrapper>
      <div className="header-wrapper">
        <h5>2. Decreasing Amount</h5>
      </div>
      <div className="select-position common-bg decrease-bg">
        <div className="decrease-percent">
          <p>0%</p>
          <div>
            <div className="box-percent">25%</div>
            <div className="box-percent">50%</div>
            <div className="box-percent">75%</div>
            <div className="box-percent">Max</div>
          </div>
        </div>
        <div className="range">
          <Range percent={0} handlePercent={() => {}} />
        </div>
      </div>
      <DecreasePoolInfoLoading />
    </DecreaseSelectPositionWrapper>
  );
};

export default DecreaseAmountPositionLoading;
