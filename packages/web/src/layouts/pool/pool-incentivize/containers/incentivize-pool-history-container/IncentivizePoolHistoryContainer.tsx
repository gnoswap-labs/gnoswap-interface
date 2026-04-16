import { useWallet } from "@hooks/wallet/data/use-wallet";
import { ExtendedPoolStakingModel } from "@models/pool/pool-staking";
import { useGetPoolStakingListByAddress } from "@query/pools/use-get-pool-staking-list-by-address";

import { GNS_TOKEN } from "@common/values/token-constant";
import { useGnotToGnot } from "@hooks/token/data/use-gnot-wugnot";
import { makeDisplayTokenAmount } from "@utils/token-utils";
import IncentivizePoolHistory from "../../components/incentivize-pool-history/IncentivizePoolHistory";

const IncentivizePoolHistoryContainer = () => {
  const { account } = useWallet();
  const { gnot, wugnotPath, getGnotPath } = useGnotToGnot();

  const { data: rawPoolStakingList = [], isFetched: isFetchedStakingList } = useGetPoolStakingListByAddress(
    account?.address || "",
    {
      enabled: !!account?.address,
    },
  );

  const poolStakingList: ExtendedPoolStakingModel[] = rawPoolStakingList
    .map(item => {
      const isWugnot = item.rewardToken.path === wugnotPath;
      const displayToken = isWugnot
        ? { ...item.rewardToken, ...getGnotPath(item.rewardToken), path: gnot?.path || item.rewardToken.path }
        : item.rewardToken;

      return {
        ...item,
        rewardToken: displayToken,
        remainingAmount: String(makeDisplayTokenAmount(item.rewardToken, item.remainingAmount || "0") ?? "0"),
        incentivizedAmount: String(makeDisplayTokenAmount(item.rewardToken, item.incentivizedAmount || "0") ?? "0"),
        unvestedAmount: String(makeDisplayTokenAmount(item.rewardToken, item.unvestedAmount || "0") ?? "0"),
        depositGnsAmount: String(
          makeDisplayTokenAmount(GNS_TOKEN, (item as ExtendedPoolStakingModel).depositGnsAmount || "0") ?? "0",
        ),
      };
    })
    .sort((a, b) => {
      const dateA = new Date(a.startTimestamp);
      const dateB = new Date(b.startTimestamp);

      return dateA.getTime() - dateB.getTime();
    });

  return isFetchedStakingList && poolStakingList.length > 0 ? (
    <IncentivizePoolHistory stakingList={poolStakingList} />
  ) : null;
};

export default IncentivizePoolHistoryContainer;
