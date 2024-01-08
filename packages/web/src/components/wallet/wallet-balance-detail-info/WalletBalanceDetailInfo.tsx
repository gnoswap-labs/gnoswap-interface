import IconInfo from "@components/common/icons/IconInfo";
import Tooltip from "@components/common/tooltip/Tooltip";
import BigNumber from "bignumber.js";
import React from "react";
import {
  WalletBalanceDetailInfoTooltipContent,
  WalletBalanceDetailInfoWrapper,
} from "./WalletBalanceDetailInfo.styles";
import PulseSkeleton from "@components/common/pulse-skeleton/PulseSkeleton";

interface WalletBalanceDetailInfoProps {
  title: string;
  value: string;
  tooltip?: string;
  button?: React.ReactNode;
  loading: boolean;
}

const WalletBalanceDetailInfo: React.FC<WalletBalanceDetailInfoProps> = ({
  title,
  value,
  tooltip,
  button,
  loading,
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
        <PulseSkeleton loading={loading} w={120} h={20} className="pule-skeleton">
          <span className="value">
            ${BigNumber(value).decimalPlaces(2).toFormat()}
          </span>
        </PulseSkeleton>

        {/* {loading ? (
          <div className="value">
            <span css={pulseSkeletonStyle({ h: 20, w: "120px" })} />
          </div>
        ) : (
          <span className="value">
            ${BigNumber(value).decimalPlaces(2).toFormat()}
          </span>
        )} */}
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
