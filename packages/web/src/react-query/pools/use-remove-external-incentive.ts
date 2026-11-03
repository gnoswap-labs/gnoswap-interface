import React from "react";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";

import { useWallet } from "@hooks/wallet/data/use-wallet";
import { CollectExternalIncentivePenaltyRequest } from "@repositories/pool/request/collect-external-incentive-penalty-request";
import { RemoveExternalIncentiveRequest } from "@repositories/pool/request/remove-external-incentive-request";

export const useRemoveExternalIncentive = (poolPath: string, incentiveID: string) => {
  const { poolRepository } = useGnoswapContext();
  const { account } = useWallet();

  const buildAdenaWalletRemoveIncentiveAction = React.useCallback(
    async (request: RemoveExternalIncentiveRequest) => {
      return poolRepository.removeExternalIncentive(request);
    },
    [poolRepository],
  );

  const buildAdenaWalletCollectPenaltyAction = React.useCallback(
    async (request: CollectExternalIncentivePenaltyRequest) => {
      return poolRepository.collectExternalIncentivePenalty(request);
    },
    [poolRepository],
  );

  const removeExternalIncentive = React.useCallback(async () => {
    const address = account?.address;
    if (!address) {
      return null;
    }

    const request: RemoveExternalIncentiveRequest = {
      poolPath,
      incentiveID,
    };

    return buildAdenaWalletRemoveIncentiveAction(request);
  }, [account?.address, buildAdenaWalletRemoveIncentiveAction, incentiveID, poolPath]);

  const collectExternalIncentivePenalty = React.useCallback(async () => {
    const address = account?.address;
    if (!address) {
      return null;
    }

    const request: CollectExternalIncentivePenaltyRequest = {
      poolPath,
      incentiveID,
    };

    return buildAdenaWalletCollectPenaltyAction(request);
  }, [account?.address, buildAdenaWalletCollectPenaltyAction, incentiveID, poolPath]);

  return { removeExternalIncentive, collectExternalIncentivePenalty };
};
