import IconDiscode from "@components/common/icons/social/IconDiscode";
import IconGitbook from "@components/common/icons/social/IconGitbook";
import IconGithub from "@components/common/icons/social/IconGithub";
import IconMedium from "@components/common/icons/social/IconMedium";
import IconTwitter from "@components/common/icons/social/IconTwitter";
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
  DISCODE: "discode",
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

  const onClickDiscode = useCallback(
    () => onClickSns(SNS_TYPE.DISCODE),
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
        <SubTitleWrapper>the One-stop Gnoland Defi Platform</SubTitleWrapper>
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
            <button onClick={onClickDiscode}>
              <IconDiscode className="icon" />
            </button>
            <button onClick={onClickMedium}>
              <IconMedium className="icon" />
            </button>
            <button onClick={onClickTwitter}>
              <IconTwitter className="icon" />
            </button>
          </div>
          <DescriptionTitle>
            Gnoswap is an open-source & audited AMM Dex that provides
            <br />a simplified concentrated-LP experience for increased capital
            efficiency.
          </DescriptionTitle>
        </DescriptionContainer>
      )}
    </GnoswapBrandWrapper>
  );
};

export default GnoswapBrand;
