import { useWallet } from "@hooks/wallet/use-wallet";
import { PositionModel } from "@models/position/position-model";
import BigNumber from "bignumber.js";
import { useCallback } from "react";
import { useGnoswapContext } from "./use-gnoswap-context";

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
      .claimAll({
        positions: claimablePositions,
        recipient: address,
      })
      .catch(() => null);
  }, [account?.address, positionRepository, positions]);

  return {
    claimAll,
  };
};
