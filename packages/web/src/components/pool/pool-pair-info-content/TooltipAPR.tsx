import OverlapLogo from "@components/common/overlap-logo/OverlapLogo";
import { ToolTipAPRWrapper } from "./TooltipAPR.styles";
import React from "react";

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
  const feeAPRRender = feeAPR ? `${feeAPR} %` : "-";
  const stakingAPRRender = stakingAPR ? `${stakingAPR} %` : "-";
  return (
    <ToolTipAPRWrapper>
      <div className="title">APR Breakdown</div>
      <div className="item">
        <div className="label">Fee APR</div>
        <div className="value">
          <OverlapLogo logos={feeLogo} size={20} />
          <div>{feeAPRRender}</div>
        </div>
      </div>
      <div className="item">
        <div className="label">Staking APR</div>
        <div className="value">
          <OverlapLogo logos={stakeLogo} size={20} />
          <div>{stakingAPRRender}</div>
        </div>
      </div>
    </ToolTipAPRWrapper>
  );
};

export default TooltipAPR;
