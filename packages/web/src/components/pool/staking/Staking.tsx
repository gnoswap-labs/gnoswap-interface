import React from "react";
import StakingContent from "@components/pool/staking-content/StakingContent";
import StakingHeader from "@components/pool/staking-header/StakingHeader";
import { StakingWrapper } from "./Staking.styles";
import { DEVICE_TYPE } from "@styles/media";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { TokenModel } from "@models/token/token-model";
import { PoolDetailModel } from "@models/pool/pool-detail-model";

interface StakingProps {
  totalApr: string;
  positions: PoolPositionModel[];
  rewardTokens: TokenModel[];
  breakpoint: DEVICE_TYPE;
  mobile: boolean;
  isDisabledButton: boolean;
  type: number;
  handleClickStakeRedirect: () => void;
  handleClickUnStakeRedirect: () => void;
  loading: boolean;
  pool: PoolDetailModel | null;
}

const Staking: React.FC<StakingProps> = ({
  totalApr,
  positions,
  rewardTokens,
  breakpoint,
  mobile,
  isDisabledButton,
  type,
  handleClickStakeRedirect,
  handleClickUnStakeRedirect,
  loading,
  pool,
}) => {
  
  return (
    <StakingWrapper>
      <StakingHeader
        breakpoint={breakpoint}
        isDisabledButton={isDisabledButton}
        handleClickStakeRedirect={handleClickStakeRedirect}
        handleClickUnStakeRedirect={handleClickUnStakeRedirect}
        isUnstake={positions.length > 0}
      />
      <StakingContent
        pool={pool}
        totalApr={totalApr}
        positions={positions}
        rewardTokens={rewardTokens}
        breakpoint={breakpoint}
        mobile={mobile}
        type={type}
        loading={loading}
      />
    </StakingWrapper>
  );
};

export default Staking;
