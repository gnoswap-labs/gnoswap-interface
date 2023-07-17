import { CONTENT_TITLE } from "@components/earn-add/earn-add-liquidity/EarnAddLiquidity";
import React from "react";
import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import { wrapper } from "./SelectFeeTier.styles";
import { FEE_RATE_OPTION } from "@constants/option.constant";

interface SelectFeeTierProps {
  active: boolean;
  data?: any;
  openFeeTier: boolean;
  onClickOpenFeeTier: () => void;
}

const feeRateInit = [
  {
    feeRate: FEE_RATE_OPTION.FEE_01,
    desc: "Best for very stable pairs",
    selectedFeeRate: "12% select",
  },
  {
    feeRate: FEE_RATE_OPTION.FEE_05,
    desc: "Best for stable pairs",
    selectedFeeRate: "67% select",
  },
  {
    feeRate: FEE_RATE_OPTION.FEE_3,
    desc: "Best for most pairs",
    selectedFeeRate: "21% select",
  },
  {
    feeRate: FEE_RATE_OPTION.FEE_1,
    desc: "Best for exotic pairs",
    selectedFeeRate: "Not created",
  },
];

const SelectFeeTier: React.FC<SelectFeeTierProps> = ({
  active,
  openFeeTier,
  onClickOpenFeeTier,
  data = feeRateInit,
}) => {
  return (
    <div css={wrapper}>
      <section className="title-content" onClick={onClickOpenFeeTier}>
        <h5 className="title">{CONTENT_TITLE.FEE_TIER}</h5>
        <Badge
          text={data?.fee ?? FEE_RATE_OPTION.FEE_3}
          type={BADGE_TYPE.LINE}
        />
      </section>
      {active && openFeeTier && (
        <section className="select-fee-wrap">
          {data.map((item: any, idx: number) => (
            <div className="fee-tier-box" key={idx}>
              <strong className="fee-rate">{item.feeRate}</strong>
              <p className="desc">{item.desc}</p>
              <span className="selected-fee-rate">{item.selectedFeeRate}</span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default SelectFeeTier;
