import React from "react";

import { TierType } from "@utils/launchpad-get-tier-number";
import { getTierDuration } from "@utils/launchpad-get-tier-number";

import { PoolTierChipWrapper } from "./LaunchpadPoolTierChip.styles";

interface LaunchpadPoolTierChipProps {
  poolTier: TierType;
}

const LaunchpadPoolTierChip = ({ poolTier }: LaunchpadPoolTierChipProps) => {
  return <PoolTierChipWrapper>{getTierDuration(poolTier)}</PoolTierChipWrapper>;
};

export default LaunchpadPoolTierChip;
