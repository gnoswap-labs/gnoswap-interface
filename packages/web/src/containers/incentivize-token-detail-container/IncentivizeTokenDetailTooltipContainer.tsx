import { PoolStakingModel } from "@models/pool/pool-staking";
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
  Comp,
  poolPath,
}: {
  Comp: React.ComponentType<{
    poolStakings: PoolStakingModel[];
    latestBlockHeight: string;
  }>;
  poolPath?: string;
}) {
  console.log("🚀 ~ poolPath:", poolPath);
  const { data: poolStakings = [] } = useGetPoolStakingListByPoolPath(
    poolPath || "",
    {
      enabled: !!poolPath,
    },
  );
  const { data: blockHeight = "0" } = useGetLastedBlockHeight();

  return (
    <>
      <Comp latestBlockHeight={blockHeight} poolStakings={poolStakings} />
    </>
  );
}

export default IncentivizeTokenDetailTooltipContainer;
