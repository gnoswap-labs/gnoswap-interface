import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconNote from "@components/common/icons/IconNote";
import { DEVICE_TYPE } from "@styles/media";
import React from "react";
import LearnMoreModal from "../learn-more-modal/LearnMoreModal";
import { StakingHeaderWrapper } from "./StakingHeader.styles";
import { useState } from "react";

interface StakingHeaderProps {
  breakpoint: DEVICE_TYPE;
  isDisabledButton: boolean;
  handleClickStakeRedirect: () => void;
  handleClickUnStakeRedirect: () => void;
  canUnstake: boolean;
  isOtherPosition: boolean;
  canStake: boolean;
}

const STAKING_INSTRUCTION_URL =
  "https://docs.gnoswap.io/user-guide/staking/stake-positions";

const StakingHeader: React.FC<StakingHeaderProps> = ({
  isDisabledButton,
  handleClickStakeRedirect,
  handleClickUnStakeRedirect,
  canUnstake,
  isOtherPosition,
  canStake,
}) => {
  const [isShowLearnModal, setIsShowLearnModal] = useState(false);
  return (
    <StakingHeaderWrapper>
      <div className="left-wrap">
        <h2>Staking</h2>
        <div
          className="logo-wrap"
          onClick={() => window.open(STAKING_INSTRUCTION_URL, "_blank")}
        >
          <span className="lean-more">Learn More</span>
          <IconNote className="icon-logo" />
        </div>
      </div>
      <div className="button-wrap">
        {canUnstake && !isOtherPosition && (
          <Button
            disabled={isDisabledButton || !canUnstake}
            text="Unstake Position"
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
            text="Stake Position"
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
      {isShowLearnModal && (
        <LearnMoreModal setIsShowLearnMoreModal={setIsShowLearnModal} />
      )}
    </StakingHeaderWrapper>
  );
};

export default StakingHeader;
