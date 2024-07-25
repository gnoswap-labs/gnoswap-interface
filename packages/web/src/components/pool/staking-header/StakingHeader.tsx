import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconNote from "@components/common/icons/IconNote";
import { DEVICE_TYPE } from "@styles/media";
import React from "react";
import { StakingHeaderWrapper } from "./StakingHeader.styles";
import { useTranslation } from "react-i18next";

interface StakingHeaderProps {
  breakpoint: DEVICE_TYPE;
  isDisabledButton: boolean;
  handleClickStakeRedirect: () => void;
  handleClickUnStakeRedirect: () => void;
  isUnstake: boolean;
  isOtherPosition: boolean;
  isStaked: boolean;
}

const STAKING_INSTRUCTION_URL =
  "https://docs.gnoswap.io/user-guide/staking/stake-positions";

const StakingHeader: React.FC<StakingHeaderProps> = ({
  isDisabledButton,
  handleClickStakeRedirect,
  handleClickUnStakeRedirect,
  isUnstake,
  isOtherPosition,
  isStaked,
}) => {
  const { t } = useTranslation();

  return (
    <StakingHeaderWrapper>
      <div className="left-wrap">
        <h2>{t("Pool:staking.title")}</h2>
        <div
          className="logo-wrap"
          onClick={() => window.open(STAKING_INSTRUCTION_URL, "_blank")}
        >
          <span className="lean-more">{t("common:learnMore")}</span>
          <IconNote className="icon-logo" />
        </div>
      </div>
      <div className="button-wrap">
        {isUnstake && !isOtherPosition && (
          <Button
            disabled={isDisabledButton || !isUnstake}
            text={t("Pool:staking.btn.unstake")}
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
        {isStaked && (
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
