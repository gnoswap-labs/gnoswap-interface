import React from "react";
import { wrapper } from "./SelectUnstakePeriod.styles";
import { cx } from "@emotion/css";
import { CONTENT_TITLE } from "@components/stake/stake-liquidity/StakeLiquidity";

interface SelectUnstakePeriodProps {
  period: any;
  activePeriod: number;
  onClickPeriod: (idx: number) => void;
}

const SelectUnstakePeriod: React.FC<SelectUnstakePeriodProps> = ({
  period,
  activePeriod,
  onClickPeriod,
}) => {
  return (
    <section css={wrapper}>
      <h5 className="section-title">{CONTENT_TITLE.PERIOD}</h5>
      <div className="select-period">
        {period.map((item: any, idx: number) => (
          <div
            className={cx("period-box", { active: activePeriod === idx })}
            onClick={() => onClickPeriod(idx)}
            key={idx}
          >
            <span className="days">{item.days}</span>
            <span className="apr-value">{item.apr}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SelectUnstakePeriod;
