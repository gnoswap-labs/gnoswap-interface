import React from "react";
import StakingContent from "@components/pool/staking-content/StakingContent";
import StakingHeader from "@components/pool/staking-header/StakingHeader";
import { StakingAnchor, StakingWrapper } from "./Staking.styles";
import { DEVICE_TYPE } from "@styles/media";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { PoolDetailModel } from "@models/pool/pool-detail-model";

interface StakingProps {
  totalApr: string;
  stakedPosition: PoolPositionModel[];
  breakpoint: DEVICE_TYPE;
  mobile: boolean;
  isDisabledButton: boolean;
  type: number;
  handleClickStakeRedirect: () => void;
  handleClickUnStakeRedirect: () => void;
  loading: boolean;
  pool: PoolDetailModel | null;
  isOtherPosition: boolean;
}

const Staking: React.FC<StakingProps> = ({
  totalApr,
  stakedPosition,
  breakpoint,
  mobile,
  isDisabledButton,
  type,
  handleClickStakeRedirect,
  handleClickUnStakeRedirect,
  loading,
  pool,
  isOtherPosition,
}) => {
  return (
    <>
      <StakingAnchor id="staking" />
      <StakingWrapper>
        <StakingHeader
          breakpoint={breakpoint}
          isDisabledButton={isDisabledButton}
          handleClickStakeRedirect={handleClickStakeRedirect}
          handleClickUnStakeRedirect={handleClickUnStakeRedirect}
          isUnstake={stakedPosition.length > 0}
          isOtherPosition={isOtherPosition}
          isStaked={(pool?.rewardTokens?.length || 0) > 0}
        />
        <StakingContent
          pool={pool}
          totalApr={totalApr}
          stakedPosition={stakedPosition}
          breakpoint={breakpoint}
          mobile={mobile}
          type={type}
          loading={loading}
        />
      </StakingWrapper>
    </>
  );
};

export default Staking;
