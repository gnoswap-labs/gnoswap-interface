import React from "react";
import { useTranslation } from "react-i18next";

import { TierType } from "@utils/launchpad-get-tier-number";
import { getTierDuration } from "@utils/launchpad-get-tier-number";

import { PoolTierChipWrapper } from "./LaunchpadPoolTierChip.styles";

interface LaunchpadPoolTierChipProps {
  poolTier: TierType;
}

const LaunchpadPoolTierChip = ({ poolTier }: LaunchpadPoolTierChipProps) => {
  const { t } = useTranslation();

  return (
    <PoolTierChipWrapper>
      {getTierDuration(poolTier, t, true)}
    </PoolTierChipWrapper>
  );
};

export default LaunchpadPoolTierChip;
