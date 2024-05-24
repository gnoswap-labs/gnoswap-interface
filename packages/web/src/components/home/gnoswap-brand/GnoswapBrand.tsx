import IconGitbook from "@components/common/icons/social/IconGitbook";
import IconGithub from "@components/common/icons/social/IconGithub";
import IconMedium from "@components/common/icons/social/IconMedium";
import IconTwitter from "@components/common/icons/social/IconTwitter";
import IconDiscord from "@components/common/icons/social/IconDiscord";
import { DeviceSize } from "@styles/media";
import React, { useCallback } from "react";
import { ValuesType } from "utility-types";
import {
  GnoswapBrandWrapper,
  HeroTitleContainer,
  TitleWrapper,
  SubTitleWrapper,
  DescriptionTitle,
  DescriptionContainer,
} from "./GnoswapBrand.styles";

export const SNS_TYPE = {
  GITHUB: "github",
  GITBOOK: "gitbook",
  DISCORD: "discord",
  TELEGRAM: "telegram",
  MEDIUM: "medium",
  TWITTER: "twitter",
} as const;
export type SNS_TYPE = ValuesType<typeof SNS_TYPE>;

interface GnoswapBrandProps {
  onClickSns: (snsType: SNS_TYPE) => void;
  windowSize: number;
}

const GnoswapBrand: React.FC<GnoswapBrandProps> = ({
  onClickSns,
  windowSize,
}) => {
  const onClickGithub = useCallback(
    () => onClickSns(SNS_TYPE.GITHUB),
    [onClickSns],
  );

  const onClickGitbook = useCallback(
    () => onClickSns(SNS_TYPE.GITBOOK),
    [onClickSns],
  );

  const onClickDiscord = useCallback(
    () => onClickSns(SNS_TYPE.DISCORD),
    [onClickSns],
  );

  const onClickMedium = useCallback(
    () => onClickSns(SNS_TYPE.MEDIUM),
    [onClickSns],
  );

  const onClickTwitter = useCallback(
    () => onClickSns(SNS_TYPE.TWITTER),
    [onClickSns],
  );

  return (
    <GnoswapBrandWrapper>
      <HeroTitleContainer>
        <TitleWrapper>
          <span>Swap</span> and <span>Earn</span>
          <br />
          on Gnoswap
        </TitleWrapper>
        <SubTitleWrapper>the One-stop Gnoland DeFi Platform</SubTitleWrapper>
      </HeroTitleContainer>
      {windowSize > DeviceSize.mobile && (
        <DescriptionContainer>
          <div className="sns">
            <button onClick={onClickGithub}>
              <IconGithub className="icon" />
            </button>
            <button onClick={onClickGitbook}>
              <IconGitbook className="icon" />
            </button>
            <button onClick={onClickDiscord}>
              <IconDiscord className="icon" />
            </button>
            <button onClick={onClickMedium}>
              <IconMedium className="icon" />
            </button>
            <button onClick={onClickTwitter}>
              <IconTwitter className="icon" />
            </button>
          </div>
          <DescriptionTitle>
            The first Concentrated Liquidity AMM DEX built using Gnolang <br />
            to offer the most simplified and user-friendly DeFi experience for traders.
          </DescriptionTitle>
        </DescriptionContainer>
      )}
    </GnoswapBrandWrapper>
  );
};

export default GnoswapBrand;
