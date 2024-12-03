import React from "react";

import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { PoolStakingModel } from "@models/pool/pool-staking";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { DEVICE_TYPE } from "@styles/media";

import StakingContent from "./staking-content/StakingContent";
import StakingHeader from "./staking-header/StakingHeader";

import { StakingAnchor, StakingWrapper } from "./Staking.styles";

interface StakingProps {
  pool: PoolDetailModel | null;
  totalApr: string;
  stakedPosition: PoolPositionModel[];
  poolStakings: PoolStakingModel[];
  breakpoint: DEVICE_TYPE;
  mobile: boolean;
  isDisabledButton: boolean;
  type: number;
  handleClickStakeRedirect: () => void;
  handleClickUnStakeRedirect: () => void;
  loading: boolean;
  isOtherPosition: boolean;
}

const Staking: React.FC<StakingProps> = ({
  pool,
  totalApr,
  stakedPosition,
  poolStakings,
  breakpoint,
  mobile,
  isDisabledButton,
  type,
  handleClickStakeRedirect,
  handleClickUnStakeRedirect,
  loading,
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
          canUnstake={stakedPosition.length > 0}
          isOtherPosition={isOtherPosition}
          canStake={(pool?.rewardTokens?.length || 0) > 0}
        />
        <StakingContent
          pool={pool}
          totalApr={totalApr}
          stakedPosition={stakedPosition}
          poolStakings={poolStakings}
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
