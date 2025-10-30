import React from "react";
import { useTranslation } from "react-i18next";

import Button, { ButtonHierarchy } from "@components/common/button/Button";
import { DEVICE_TYPE } from "@styles/media";
import { useWindowSize } from "@hooks/common/use-window-size";

import { StakingHeaderWrapper } from "./StakingHeader.styles";
import VideoGuideTrigger from "@components/common/video-guide-trigger/VideoGuideTrigger";

interface StakingHeaderProps {
  breakpoint: DEVICE_TYPE;
  isDisabledButton: boolean;
  handleClickStakeRedirect: () => void;
  handleClickUnStakeRedirect: () => void;
  canUnstake: boolean;
  isOtherPosition: boolean;
  canStake: boolean;
  onOpenVideoGuide: (type: "STAKING") => void;
}

const StakingHeader: React.FC<StakingHeaderProps> = ({
  isDisabledButton,
  handleClickStakeRedirect,
  handleClickUnStakeRedirect,
  canUnstake,
  isOtherPosition,
  canStake,
  onOpenVideoGuide,
}) => {
  const { t } = useTranslation();
  const { isMobile } = useWindowSize();

  const handleOpenVideoGuide = React.useCallback(() => {
    onOpenVideoGuide("STAKING");
  }, [onOpenVideoGuide]);

  return (
    <StakingHeaderWrapper>
      <div className="left-wrap">
        <h2>{t("Pool:staking.title")}</h2>
        <VideoGuideTrigger
          text={`${t("common:guide.staking.title")} ▶`}
          onClick={handleOpenVideoGuide}
          style={{ position: "relative", top: isMobile ? "2px" : "3px" }}
        />
      </div>
      <div className="button-wrap">
        {canUnstake && !isOtherPosition && (
          <Button
            text={t("Pool:staking.btn.unstake")}
            disabled={isDisabledButton || !canUnstake}
            onClick={handleClickUnStakeRedirect}
            style={{
              hierarchy: ButtonHierarchy.Primary,
              fullWidth: true,
              height: 36,
              padding: "0px 16px",
              fontType: "p1",
            }}
          />
        )}
        {canStake && (
          <Button
            text={t("Pool:staking.btn.stake")}
            onClick={handleClickStakeRedirect}
            style={{
              hierarchy: ButtonHierarchy.Primary,
              fullWidth: true,
              height: 36,
              padding: "0px 16px",
              fontType: "p1",
            }}
          />
        )}
      </div>
    </StakingHeaderWrapper>
  );
};

export default StakingHeader;
