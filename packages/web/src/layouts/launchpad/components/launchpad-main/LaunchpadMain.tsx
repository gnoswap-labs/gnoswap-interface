/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";

import { LaunchpadProjectSummaryModel } from "@models/launchpad";
import { EXT_URL } from "@constants/external-url.contant";
import { DEVICE_TYPE } from "@styles/media";

import Button from "@components/common/button/Button";
import { ButtonStyleProps } from "@components/common/button/Button.styles";
import IconRightArrow from "@components/common/icons/IconRightArrow";
import { Divider } from "@components/common/divider/divider";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { ThemeKeys } from "@styles/ThemeTypes";
import { rawToDisplayAmount, toNumberFormat } from "@utils/number-utils";
import { Trans, useTranslation } from "react-i18next";
import IconLaunchpadMain from "@components/common/icons/IconLaunchpadMain";
import { GNS_TOKEN } from "@common/values/token-constant";
import { VIDEO_GUIDE_TYPES } from "@constants/video-guide.constant";

interface LaunchpadMainProps {
  data: LaunchpadProjectSummaryModel;
  isLoading: boolean;
  isFetched: boolean;
  breakpoint: DEVICE_TYPE;
  themeKey: ThemeKeys;
  onOpenVideoGuide: (type: "LAUNCHPAD") => void;
}

const LaunchpadMain: React.FC<LaunchpadMainProps> = ({ data, isLoading, breakpoint, themeKey, onOpenVideoGuide }) => {
  const { t } = useTranslation();
  const defaultStyle: ButtonStyleProps = {
    textColor: "text32",
    bgColor: themeKey === "dark" ? "border02" : "background04",
  };

  const displayLaunchpadSummary: LaunchpadProjectSummaryModel = React.useMemo(() => {
    return {
      ...data,
      totalDepositedGnsAmount: rawToDisplayAmount(data.totalDepositedGnsAmount, GNS_TOKEN.decimals),
    };
  }, [data]);

  const handleOpenVideoGuide = React.useCallback(() => {
    onOpenVideoGuide(VIDEO_GUIDE_TYPES.LAUNCHPAD);
  }, [onOpenVideoGuide]);

  return (
    <>
      <section className="launchpad-section">
        <div className="launchpad-title-container">
          {breakpoint !== DEVICE_TYPE.MOBILE && <h3 className="title">{t("Launchpad:main.title")}</h3>}
          {breakpoint === DEVICE_TYPE.MOBILE ? (
            <h4 className="sub-title">
              <Trans ns="Launchpad" i18nKey={"main.subTitleMobile"}>
                Where Pioneers and Supporters United —<br />
                Unveil Tomorrow&apos;s Breakthroughs on
                <br />
                Gno.land, Powered by $GNS.
              </Trans>
            </h4>
          ) : (
            <h4 className="sub-title">
              <Trans ns="Launchpad" i18nKey={"main.subTitle"}>
                Where Pioneers and Supporters United — Unveil Tomorrow&apos;s
                <br />
                Breakthroughs on Gno.land, Powered by $GNS.
              </Trans>
            </h4>
          )}
        </div>
        <div className="launchpad-button-wrapper">
          <span className="launchpad-guide-button">
            <Button
              text={t("Launchpad:main.button.howToParticipate")}
              style={defaultStyle}
              rightIcon={breakpoint !== DEVICE_TYPE.MOBILE && <IconRightArrow className="icon-right-arrow" />}
              onClick={handleOpenVideoGuide}
            />
          </span>
          <span className="launchpad-guide-button">
            <Link href={EXT_URL.DOCS.ROOT} target="_blank">
              <Button
                text={t("Launchpad:main.button.submitProject")}
                style={defaultStyle}
                rightIcon={breakpoint !== DEVICE_TYPE.MOBILE && <IconRightArrow className="icon-right-arrow" />}
              />
            </Link>
          </span>
        </div>
        <Divider />
        <div className="launchpad-data-wrapper">
          <div className="launchpad-data-list">
            {isLoading && (
              <span className="launchpad-data-value">
                <span css={pulseSkeletonStyle({ w: "120px", h: 19.5 })} />
              </span>
            )}
            {!isLoading && (
              <span className="launchpad-data-value">
                {displayLaunchpadSummary?.totalParticipants
                  ? toNumberFormat(displayLaunchpadSummary.totalParticipants, 2)
                  : "-"}
              </span>
            )}
            <span className="launchpad-data-key">{t("Launchpad:main.total.participants")}</span>
          </div>
          <div className="launchpad-data-list">
            {isLoading && (
              <span className="launchpad-data-value">
                <span css={pulseSkeletonStyle({ w: "120px", h: 24 })} />
              </span>
            )}
            {!isLoading && (
              <span className="launchpad-data-value">
                <img src="/gns.svg" alt="GnoSwap logo" />
                {displayLaunchpadSummary?.totalDepositedGnsAmount
                  ? toNumberFormat(displayLaunchpadSummary.totalDepositedGnsAmount, 2)
                  : "-"}
              </span>
            )}
            <span className="launchpad-data-key">{t("Launchpad:main.total.deposited")}</span>
          </div>
          <div className="launchpad-data-list">
            {isLoading && (
              <span className="launchpad-data-value">
                <span css={pulseSkeletonStyle({ w: "120px", h: 19.5 })} />
              </span>
            )}
            {!isLoading && (
              <span className="launchpad-data-value">
                {displayLaunchpadSummary?.totalDistributedAmount
                  ? `$${toNumberFormat(displayLaunchpadSummary.totalDistributedAmount, 2)}`
                  : "-"}
              </span>
            )}
            <span className="launchpad-data-key">{t("Launchpad:main.total.distributed")}</span>
          </div>
        </div>
      </section>
      <div className="launchpad-image-wrapper">
        {breakpoint === DEVICE_TYPE.MOBILE && (
          <div className="launchpad-mobile-title-wrapper">
            <h3 className="mobile-title">{t("Launchpad:main.title")}</h3>
          </div>
        )}
        <IconLaunchpadMain themeKey={themeKey} className="icon-launchpad" />
      </div>
    </>
  );
};

export default LaunchpadMain;
