import IncentivizeTokenDetailTooltipContent from "@components/pool/incentivized-token-detail-tooltip-content/IncentivizeTokenDetailTooltipContent";
import {
  useGetLastedBlockHeight,
  useGetPoolStakingListByPoolPath,
} from "@query/pools";

export const TIER_MAP: Record<string, number> = {
  "1": 7776000,
  "2": 15552000,
  "3": 31536000,
};
function IncentivizeTokenDetailTooltipContainer({
  poolPath,
}: {
  poolPath?: string;
}) {
  const { data: poolStakings = [] } = useGetPoolStakingListByPoolPath(
    poolPath || "",
    {
      enabled: !!poolPath,
    },
  );
  const { data: blockHeight = "0" } = useGetLastedBlockHeight();

  return (
    <>
      <IncentivizeTokenDetailTooltipContent
        latestBlockHeight={blockHeight}
        poolStakings={poolStakings}
      />
    </>
  );
}

export default IncentivizeTokenDetailTooltipContainer;
