import { useWallet } from "@hooks/wallet/use-wallet";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { useCallback } from "react";
import { useGnoswapContext } from "./use-gnoswap-context";

export const usePosition = (positions: PoolPositionModel[]) => {
  const { positionRepository } = useGnoswapContext();
  const { account } = useWallet();

  const claimAll = useCallback(() => {
    const address = account?.address;
    if (!address) {
      return null;
    }

    const lpTokenIds = positions
      .filter(
        position =>
          position.unclaimedFee0Amount + position.unclaimedFee1Amount > 0,
      )
      .map(position => position.lpTokenId);
    return positionRepository.claimAll({
      lpTokenIds,
      receipient: address,
    });
  }, [account?.address, positionRepository, positions]);

  return {
    claimAll,
  };
};
