import IconInfo from "@components/common/icons/IconInfo";
import Tooltip from "@components/common/tooltip/Tooltip";
import {
  SHAPE_TYPES,
  skeletonBalanceDetail,
} from "@constants/skeleton.constant";
import React from "react";
import {
  WalletBalanceDetailInfoTooltipContent,
  WalletBalanceDetailInfoWrapper,
} from "./WalletBalanceDetailInfo.styles";

interface WalletBalanceDetailInfoProps {
  title: string;
  value: string;
  tooltip?: string;
  button?: React.ReactNode;
  loading: boolean;
  connected: boolean;
}

const WalletBalanceDetailInfo: React.FC<WalletBalanceDetailInfoProps> = ({
  title,
  value,
  tooltip,
  button,
  loading,
  connected,
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
        {connected ? (
          loading ? (
            <div className="value">
              <span
                css={skeletonBalanceDetail("120px", SHAPE_TYPES.ROUNDED_SQUARE)}
              />
            </div>
          ) : (
            <span className="value">
              $
              {Number(value).toLocaleString("en-US", {
                maximumFractionDigits: 2,
              })}
            </span>
          )
        ) : (
          <span className="value">$0</span>
        )}
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
