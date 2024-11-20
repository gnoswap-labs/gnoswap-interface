import React from "react";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";

import { useWallet } from "@hooks/wallet/use-wallet";
import { TokenModel } from "@models/token/token-model";

export const useRemoveExternalIncentive = (
  poolPath: string,
  rewardToken: TokenModel,
  startTimestamp: string,
  endTimestamp: string,
) => {
  const { poolRepository } = useGnoswapContext();
  const { account } = useWallet();

  const removeExternalIncentive = React.useCallback(async () => {
    const address = account?.address;
    if (!address) {
      return null;
    }

    return poolRepository.removeExternalIncentive({
      poolPath,
      rewardToken,
      startTimestamp,
      endTimestamp,
    });
  }, [account?.address, poolRepository, poolPath, rewardToken]);

  return { removeExternalIncentive };
};
