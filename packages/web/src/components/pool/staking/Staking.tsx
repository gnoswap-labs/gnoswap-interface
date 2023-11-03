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
}

const Staking: React.FC<StakingProps> = ({
  info,
  breakpoint,
  rewardInfo,
  mobile,
  isDisabledButton,
}) => {
  return (
    <StakingWrapper>
      <StakingHeader breakpoint={breakpoint} isDisabledButton={isDisabledButton} />
      <StakingContent
        content={info}
        rewardInfo={rewardInfo}
        breakpoint={breakpoint}
        mobile={mobile}
      />
    </StakingWrapper>
  );
};

export default Staking;
