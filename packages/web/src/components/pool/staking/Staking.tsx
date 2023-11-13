import React from "react";
import StakingContent from "@components/pool/staking-content/StakingContent";
import StakingHeader from "@components/pool/staking-header/StakingHeader";
import { StakingWrapper } from "./Staking.styles";
import { DEVICE_TYPE } from "@styles/media";

interface StakingProps {
  info: any;
  rewardInfo: any;
  breakpoint: DEVICE_TYPE;
  mobile: boolean;
  isDisabledButton: boolean;
  type: number;
  handleClickStaking: () => void;
  handleClickStakeRedirect: () => void;
  handleClickUnStakeRedirect: () => void;
}

const Staking: React.FC<StakingProps> = ({
  info,
  breakpoint,
  rewardInfo,
  mobile,
  isDisabledButton,
  type,
  handleClickStaking,
  handleClickStakeRedirect,
  handleClickUnStakeRedirect,
}) => {
  return (
    <StakingWrapper>
      <StakingHeader breakpoint={breakpoint} isDisabledButton={isDisabledButton} handleClickStakeRedirect={handleClickStakeRedirect} handleClickUnStakeRedirect={handleClickUnStakeRedirect} />
      <StakingContent
        content={info}
        rewardInfo={rewardInfo}
        breakpoint={breakpoint}
        mobile={mobile}
        type={type}
        handleClickStaking={handleClickStaking}
      />
    </StakingWrapper>
  );
};

export default Staking;
