import React from "react";
import IconInfo from "@components/common/icons/IconInfo";
import Tooltip from "@components/common/tooltip/Tooltip";
import {
  WalletBalanceDetailInfoTooltipContent,
  WalletBalanceDetailInfoWrapper,
} from "./WalletBalanceDetailInfo.styles";

interface WalletBalanceDetailInfoProps {
  title: string;
  value: string;
  tooltip?: string;
  button?: React.ReactNode;
}

const WalletBalanceDetailInfo: React.FC<WalletBalanceDetailInfoProps> = ({
  title,
  value,
  tooltip,
  button,
}) => {
  return (
    <WalletBalanceDetailInfoWrapper>
      <div className="title-wrapper">
        <span className="title">{title}</span>
        {tooltip !== undefined && (
          <WalletBalanceDetailInfoTooltip tooltip={tooltip} />
        )}
      </div>
      <div className="value-wrapper">
        <span className="value">{value}</span>
        {button && <div className="button-wrapper">{button}</div>}
      </div>
    </WalletBalanceDetailInfoWrapper>
  );
};

export const WalletBalanceDetailInfoTooltip: React.FC<{ tooltip: string }> = ({
  tooltip,
}) => {
  const TooltipFloatingContent = (
    <WalletBalanceDetailInfoTooltipContent>
      {tooltip}
    </WalletBalanceDetailInfoTooltipContent>
  );

  return (
    <Tooltip placement="top" FloatingContent={TooltipFloatingContent}>
      <IconInfo />
    </Tooltip>
  );
};

export default WalletBalanceDetailInfo;
