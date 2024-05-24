import OverlapLogo from "@components/common/overlap-logo/OverlapLogo";
import { ToolTipAPRWrapper } from "./TooltipAPR.styles";
import React from "react";
import { numberToRate } from "@utils/string-utils";

interface Props {
  feeAPR: string;
  stakingAPR: string;
  feeLogo: string[];
  stakeLogo: string[];
}

const TooltipAPR: React.FC<Props> = ({
  feeAPR,
  stakingAPR,
  feeLogo,
  stakeLogo,
}) => {
  return (
    <ToolTipAPRWrapper>
      <div className="title">APR Breakdown</div>
      <div className="item">
        <div className="label">Fee APR</div>
        <div className="value">
          <OverlapLogo logos={feeLogo} size={20} />
          <div>{numberToRate(feeAPR)}</div>
        </div>
      </div>
      <div className="item">
        <div className="label">Staking APR</div>
        <div className="value">
          <OverlapLogo logos={stakeLogo} size={20} />
          <div>{numberToRate(stakingAPR)}</div>
        </div>
      </div>
    </ToolTipAPRWrapper>
  );
};

export default TooltipAPR;
