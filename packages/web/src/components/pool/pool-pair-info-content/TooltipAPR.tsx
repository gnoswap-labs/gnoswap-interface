import { ToolTipAPRWrapper } from "./TooltipAPR.styles";
import React from "react";
import { formatApr } from "@utils/string-utils";
import { TokenModel } from "@models/token/token-model";
import OverlapTokenLogo from "@components/common/overlap-token-logo/OverlapTokenLogo";

interface Props {
  feeAPR: string;
  stakingAPR: string;
  feeLogo: TokenModel[];
  stakeLogo: TokenModel[];
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
          <OverlapTokenLogo tokens={feeLogo} size={20} />
          <div>{formatApr(feeAPR)}</div>
        </div>
      </div>
      <div className="item">
        <div className="label">Staking APR</div>
        <div className="value">
          <OverlapTokenLogo tokens={stakeLogo} size={20} />
          <div>{formatApr(stakingAPR)}</div>
        </div>
      </div>
    </ToolTipAPRWrapper>
  );
};

export default TooltipAPR;
