import { GnoProvider } from "@common/clients/gno-provider/gno-provider";
import { WRAPPED_GNOT_PATH } from "@constants/environment.constant";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { PositionModel } from "@models/position/position-model";
import { ClaimAllRequest } from "@repositories/position/request";
import { ClaimRequest } from "@repositories/position/request/claim-request";
import { checkGnotPath } from "@utils/common";
import { useCallback } from "react";
import { useGnoswapContext } from "../../common/use-gnoswap-context";

export interface ClaimAllInput {
  swapFeeTokenPaths: string[];
  hasGnotStakingReward: boolean;
  positionsWithSwapFee: string[];
  positionsWithStakingReward: string[];
}

export const buildClaimAllInputFromPositions = (positions: PositionModel[]): ClaimAllInput => {
  const swapFeeTokenPathSet = new Set<string>();
  const positionsWithSwapFeeSet = new Set<string>();
  const positionsWithStakingRewardSet = new Set<string>();
  let hasGnotStakingReward = false;

  positions.forEach(position => {
    position.rewards.forEach(reward => {
      if (Number(reward.claimableAmount ?? "0") <= 0) return;

      if (reward.rewardToken.rewardType === "SWAP_FEE") {
        swapFeeTokenPathSet.add(reward.rewardToken.path);
        positionsWithSwapFeeSet.add(position.lpTokenId);
      } else {
        positionsWithStakingRewardSet.add(position.lpTokenId);
        if (checkGnotPath(reward.rewardToken.path) === WRAPPED_GNOT_PATH) {
          hasGnotStakingReward = true;
        }
      }
    });
  });

  return {
    swapFeeTokenPaths: Array.from(swapFeeTokenPathSet),
    hasGnotStakingReward,
    positionsWithSwapFee: Array.from(positionsWithSwapFeeSet),
    positionsWithStakingReward: Array.from(positionsWithStakingRewardSet),
  };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const usePosition = (_positions?: PositionModel[]) => {
  const { positionRepository } = useGnoswapContext();
  const { account } = useWallet();

  const buildClaimAllAction = async (request: ClaimAllRequest) => {
    return positionRepository.sendClaimAll(request).catch(() => null);
  };

  const claimAll = useCallback(
    async ({ input }: { rpcProvider: GnoProvider | null; input: ClaimAllInput }) => {
      const address = account?.address;
      if (!address) {
        return null;
      }

      if (input.positionsWithSwapFee.length === 0 && input.positionsWithStakingReward.length === 0) {
        return null;
      }

      const request: ClaimAllRequest = {
        swapFeeTokenPaths: input.swapFeeTokenPaths,
        hasGnotStakingReward: input.hasGnotStakingReward,
        positionsWithSwapFee: input.positionsWithSwapFee,
        positionsWithStakingReward: input.positionsWithStakingReward,
        recipient: address,
      };

      return await buildClaimAllAction(request);
    },
    [account?.address, positionRepository],
  );

  const buildClaimAction = async (request: ClaimRequest) => {
    return positionRepository.sendClaim(request).catch(() => null);
  };

  const claim = useCallback(
    async (rpcProvider: GnoProvider | null, position: PoolPositionModel) => {
      const address = account?.address;
      if (!address) {
        return null;
      }

      const request: ClaimRequest = { position: position, recipient: address };

      return await buildClaimAction(request);
    },
    [account?.address, positionRepository],
  );

  return {
    claimAll,
    claim,
  };
};
