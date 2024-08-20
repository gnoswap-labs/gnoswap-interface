import { ToolTipAPRWrapper } from "./TooltipAPR.styles";
import React from "react";
import { TokenModel } from "@models/token/token-model";
import OverlapTokenLogo from "@components/common/overlap-token-logo/OverlapTokenLogo";
import { formatRate } from "@utils/new-number-utils";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return (
    <ToolTipAPRWrapper>
      <div className="title">
        {t("Pool:poolInfo.section.apr.tooltip.title")}
      </div>
      <div className="item">
        <div className="label">
          {t("Pool:poolInfo.section.apr.tooltip.feeApr")}
        </div>
        <div className="value">
          <OverlapTokenLogo tokens={feeLogo} size={20} />
          <div>{formatRate(feeAPR)}</div>
        </div>
      </div>
      <div className="item">
        <div className="label">
          {t("Pool:poolInfo.section.apr.tooltip.stakingApr")}
        </div>
        <div className="value">
          <OverlapTokenLogo tokens={stakeLogo} size={20} />
          <div>{formatRate(stakingAPR)}</div>
        </div>
      </div>
    </ToolTipAPRWrapper>
  );
};

export default TooltipAPR;
