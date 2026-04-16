import React from "react";
import Tooltip from "../tooltip/Tooltip";
import { LogoWrapper, Image, TokenSymbolWrapper } from "./MissingLogo.styles";
import { RewardType, RewardTypeEnum } from "@constants/option.constant";

interface Props {
  symbol: string;
  rewardType?: RewardType;
  showRewardType?: boolean;
  url?: string;
  className?: string;
  width: number;
  mobileWidth?: number;
  missingLogoClassName?: string;
  placeholderFontSize?: number;
  tokenTooltipClassName?: string;
  showTooltip?: boolean;
}

const MissingLogo: React.FC<Props> = ({
  symbol,
  rewardType,
  showRewardType,
  className,
  url,
  width,
  mobileWidth,
  missingLogoClassName,
  placeholderFontSize,
  tokenTooltipClassName,
  showTooltip = false,
}) => {
  const rewardTypeToDisplayText = (rewardType: RewardType): string => {
    switch (rewardType) {
      case RewardTypeEnum.SWAP_FEE:
        return "Swap Fee";
      case RewardTypeEnum.EXTERNAL_REWARD:
        return "External Reward";
      case RewardTypeEnum.INTERNAL_REWARD:
        return "Internal Reward";
      case RewardTypeEnum.INTERNAL_TIER_1:
        return "Internal Reward-Tier1";
      case RewardTypeEnum.INTERNAL_TIER_2:
        return "Internal Reward-Tier2";
      case RewardTypeEnum.INTERNAL_TIER_3:
        return "Internal Reward-Tier3";
      default:
        return rewardType;
    }
  };

  const tooltipContent = React.useMemo(() => {
    if (!showRewardType || !rewardType) {
      return symbol;
    }

    if (Array.isArray(rewardType)) {
      const rewardTypesText = rewardType.map(rt => rewardTypeToDisplayText(rt)).join(", \n");
      return `$${symbol} (${rewardTypesText})`;
    }

    return `$${symbol} (${rewardTypeToDisplayText(rewardType)})`;
  }, [showRewardType, rewardType, symbol]);

  return (
    <Tooltip
      placement="top"
      className={tokenTooltipClassName}
      forcedClose={!showTooltip}
      FloatingContent={<TokenSymbolWrapper>{tooltipContent}</TokenSymbolWrapper>}
    >
      {url ? (
        <Image mobileWidth={mobileWidth} width={width} src={url} alt="logo" className={className} />
      ) : (
        <LogoWrapper
          width={width}
          mobileWidth={mobileWidth}
          className={`missing-logo ${missingLogoClassName}`}
          placeholderFontSize={placeholderFontSize}
        >
          {(symbol || "").slice(0, 3)}
        </LogoWrapper>
      )}
    </Tooltip>
  );
};

export default MissingLogo;
