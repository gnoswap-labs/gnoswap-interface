import BigNumber from "bignumber.js";

import { useWallet } from "@hooks/wallet/data/use-wallet";
import { ExtendedPoolStakingModel } from "@models/pool/pool-staking";
import { TokenModel } from "@models/token/token-model";
import { useGetPoolStakingListByAddress } from "@query/pools/use-get-pool-staking-list-by-address";

import { GNS_TOKEN } from "@common/values/token-constant";
import { useGnotToGnot } from "@hooks/token/data/use-gnot-wugnot";
import IncentivizePoolHistory from "../../components/incentivize-pool-history/IncentivizePoolHistory";

// String/BigNumber-based shift so raw integer amounts keep full precision even beyond
const shiftToDisplay = (token: Pick<TokenModel, "decimals">, amount: string) => {
  const bn = new BigNumber(amount);
  if (bn.isNaN()) return "0";
  return bn.shiftedBy(-token.decimals).toFixed();
};

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
        remainingAmount: shiftToDisplay(displayToken, item.remainingAmount || "0"),
        incentivizedAmount: shiftToDisplay(displayToken, item.incentivizedAmount || "0"),
        unvestedAmount: shiftToDisplay(displayToken, item.unvestedAmount || "0"),
        claimableUnvestedAmount: shiftToDisplay(displayToken, item.claimableUnvestedAmount || "0"),
        depositGnsAmount: shiftToDisplay(GNS_TOKEN, (item as ExtendedPoolStakingModel).depositGnsAmount || "0"),
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
