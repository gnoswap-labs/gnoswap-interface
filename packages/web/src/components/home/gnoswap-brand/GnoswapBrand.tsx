import IconTelegram from "@components/common/icons/social/IconTelegram";
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
import { useTranslation } from "next-i18next";

export const SNS_TYPE = {
  GITHUB: "github",
  GITBOOK: "gitbook",
  DISCODE: "discode",
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
  const { t } = useTranslation();
  const onClickGithub = useCallback(
    () => onClickSns(SNS_TYPE.GITHUB),
    [onClickSns],
  );

  const onClickGitbook = useCallback(
    () => onClickSns(SNS_TYPE.GITBOOK),
    [onClickSns],
  );

  const onClickTelegram = useCallback(
    () => onClickSns(SNS_TYPE.TELEGRAM),
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
          <span>{t("Main:swap")}</span> {t("Main:and")} <span>{t("Main:earn")}</span>
          <br />
          {t("Main:onGnoswap")}
        </TitleWrapper>
        <SubTitleWrapper>{t("Main:theOne")}</SubTitleWrapper>
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
            <button onClick={onClickTelegram}>
              <IconTelegram className="icon" />
            </button>
            <button onClick={onClickMedium}>
              <IconMedium className="icon" />
            </button>
            <button onClick={onClickTwitter}>
              <IconTwitter className="icon" />
            </button>
          </div>
          <DescriptionTitle>
          {t("Main:theFirst")} <br />
          {t("Main:toOffer")} <br />
          </DescriptionTitle>
        </DescriptionContainer>
      )}
    </GnoswapBrandWrapper>
  );
};

export default GnoswapBrand;
