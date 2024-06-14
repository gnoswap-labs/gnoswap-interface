import OverlapLogo, { ILogoData } from "@components/common/overlap-logo/OverlapLogo";
import { ToolTipAPRWrapper } from "./TooltipAPR.styles";
import React from "react";
import { numberToRate } from "@utils/string-utils";

interface Props {
  feeAPR: string;
  stakingAPR: string;
  feeLogo: ILogoData[];
  stakeLogo: ILogoData[];
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
          <div>{numberToRate(feeAPR, { isRounding: false })}</div>
        </div>
      </div>
      <div className="item">
        <div className="label">Staking APR</div>
        <div className="value">
          <OverlapLogo logos={stakeLogo} size={20} />
          <div>{numberToRate(stakingAPR, { isRounding: false })}</div>
        </div>
      </div>
    </ToolTipAPRWrapper>
  );
};

export default TooltipAPR;
