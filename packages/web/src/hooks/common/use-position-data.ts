import { usePoolData } from "@hooks/pool/use-pool-data";
import { useWallet } from "@hooks/wallet/use-wallet";
import { PositionMapper } from "@models/position/mapper/position-mapper";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { useCallback, useState } from "react";
import { useGnoswapContext } from "./use-gnoswap-context";

export const usePositionData = () => {
  const { positionRepository } = useGnoswapContext();
  const { account } = useWallet();
  const { pools } = usePoolData();
  const [isError, setIsError] = useState(false);

  const getPositions = useCallback(async (): Promise<PoolPositionModel[]> => {
    if (!account?.address) {
      return [];
    }
    if (pools.length === 0) {
      return [];
    }
    setIsError(false);

    return positionRepository
      .getPositionsByAddress(account.address)
      .then(positions => {
        const poolPositions: PoolPositionModel[] = [];
        positions.forEach(position => {
          const pool = pools.find(pool => pool.path === position.poolPath);
          if (pool) {
            poolPositions.push(PositionMapper.makePoolPosition(position, pool));
          }
        });
        setIsError(false);
        return poolPositions;
      })
      .catch(() => {
        setIsError(true);
        return [];
      });
  }, [account?.address, pools, positionRepository]);

  return {
    isError,
    getPositions,
  };
};
