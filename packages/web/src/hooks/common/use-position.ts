import { useWallet } from "@hooks/wallet/use-wallet";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { useCallback } from "react";
import { useGnoswapContext } from "./use-gnoswap-context";

export const usePosition = (positions: PoolPositionModel[]) => {
  const { positionRepository } = useGnoswapContext();
  const { account } = useWallet();

  const claimAll = useCallback(async () => {
    const address = account?.address;
    if (!address) {
      return null;
    }

    const claimablePositions = positions.filter(
      position =>
        position.rewards.reduce(
          (accum, current) => accum + Number(current.claimableAmount),
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
