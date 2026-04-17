import React from "react";

import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { getGasUsed } from "@hooks/gas";

import { useWallet } from "@hooks/wallet/data/use-wallet";
import { TokenModel } from "@models/token/token-model";
import { useNetworkFee } from "@hooks/common/use-network-fee";
import { RemoveExternalIncentiveRequest } from "@repositories/pool/request/remove-external-incentive-request";
import { GnoProvider } from "@common/clients/gno-provider/gno-provider";
import { CommonError } from "@common/errors";
import { fetchAllowance } from "@common/clients/wallet-client/transaction-messages";
import { makeRemoveExternalIncentiveMessageWithApproves } from "@repositories/pool/pool.message";

export const useRemoveExternalIncentive = (
  poolPath: string,
  rewardToken: TokenModel,
  startTimestamp: string,
  endTimestamp: string,
) => {
  const { poolRepository, transactionService } = useGnoswapContext();
  const { account, walletClient } = useWallet();
  const { estimateNetworkFee } = useNetworkFee(null);

  const buildAdenaWalletRemoveIncentiveAction = async (request: RemoveExternalIncentiveRequest) => {
    return poolRepository.removeExternalIncentive(request);
  };

  const buildSocialWalletRemoveIncentiveAction = async (
    rpcProvider: GnoProvider | null,
    request: RemoveExternalIncentiveRequest,
    caller: string,
  ) => {
    if (!rpcProvider) {
      console.log("RemoveExternalIncentive: ", new CommonError("FAILED_INITIALIZE_GNO_PROVIDER"));
      return null;
    }

    const getAllowance = (packagePath: string, owner: string, spender: string) => {
      return fetchAllowance(rpcProvider, packagePath, owner, spender);
    };

    const messageRequests: RemoveExternalIncentiveRequest & { caller: string } = {
      ...request,
      caller,
    };
    const txMessages = await makeRemoveExternalIncentiveMessageWithApproves(messageRequests, getAllowance);

    const txDoc = await transactionService.createDocument({ messages: txMessages });
    await transactionService.createTransaction(txDoc);

    const { currentGasInfo, networkFee } = await estimateNetworkFee(txDoc);
    const requestWithGasInfo: RemoveExternalIncentiveRequest = {
      ...request,
      gasFee: networkFee?.amount,
      gasUsed: getGasUsed(currentGasInfo).toString(),
    };

    return poolRepository.removeExternalIncentive(requestWithGasInfo);
  };

  const removeExternalIncentive = React.useCallback(
    async ({ rpcProvider }: { rpcProvider: GnoProvider | null }) => {
      const address = account?.address;
      if (!address) {
        return null;
      }

      const request: RemoveExternalIncentiveRequest = {
        poolPath,
        rewardToken,
        startTimestamp,
        endTimestamp,
      };

      const walletType = walletClient?.getWalletType();

      return walletType === "ADENA"
        ? buildAdenaWalletRemoveIncentiveAction(request)
        : buildSocialWalletRemoveIncentiveAction(rpcProvider, request, address);
    },
    [walletClient, account?.address, poolRepository, poolPath, rewardToken],
  );

  return { removeExternalIncentive };
};
