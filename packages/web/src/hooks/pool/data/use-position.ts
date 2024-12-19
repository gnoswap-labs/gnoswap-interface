import { useWallet } from "@hooks/wallet/data/use-wallet";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { PositionModel } from "@models/position/position-model";
import BigNumber from "bignumber.js";
import { useCallback } from "react";
import { useGnoswapContext } from "../../common/use-gnoswap-context";

export const usePosition = (positions: PositionModel[]) => {
  const { positionRepository } = useGnoswapContext();
  const { account } = useWallet();

  const claimAll = useCallback(async () => {
    const address = account?.address;
    if (!address) {
      return null;
    }

    const claimablePositions = positions.filter(
      position =>
        position.reward.reduce(
          (accum, currReward) =>
            BigNumber(accum)
              .plus(Number(currReward.claimableAmount ?? "0"))
              .toNumber(),
          0,
        ) > 0,
    );

    return positionRepository
      .sendClaimAll({
        positions: claimablePositions,
        recipient: address,
      })
      .catch(() => null);
  }, [account?.address, positionRepository, positions]);

  const claim = useCallback(
    async (position: PoolPositionModel) => {
      const address = account?.address;
      if (!address) {
        return null;
      }

      return positionRepository.sendClaim({
        position: position,
        recipient: address,
      });
    },
    [account?.address, positionRepository],
  );

  return {
    claimAll,
    claim,
  };
};
