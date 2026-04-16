import { GnoProvider } from "@common/clients/gno-provider/gno-provider";
import { fetchAllowance } from "@common/clients/wallet-client/transaction-messages";
import { CommonError } from "@common/errors";
import { useNetworkFee } from "@hooks/common/use-network-fee";
import { getGasUsed } from "@hooks/gas";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { PositionModel } from "@models/position/position-model";
import { makeClaimAllMessageWithApproves, makeClaimMessageWithApproves } from "@repositories/position/position.message";
import { ClaimAllRequest } from "@repositories/position/request";
import { ClaimRequest } from "@repositories/position/request/claim-request";
import BigNumber from "bignumber.js";
import { useCallback } from "react";
import { useGnoswapContext } from "../../common/use-gnoswap-context";

export const usePosition = (positions: PositionModel[]) => {
  const { transactionService, positionRepository } = useGnoswapContext();
  const { walletClient, account } = useWallet();
  const { estimateNetworkFee } = useNetworkFee(null);

  const buildAdenaWalletClaimAllAction = async (request: ClaimAllRequest) => {
    return positionRepository.sendClaimAll(request).catch(() => null);
  };

  const buildSocialWalletClaimAllAction = async (rpcProvider: GnoProvider | null, request: ClaimAllRequest) => {
    if (!rpcProvider) {
      console.log("ClaimAll: ", new CommonError("FAILED_INITIALIZE_GNO_PROVIDER"));
      return null;
    }

    const getAllowance = (packagePath: string, owner: string, spender: string) => {
      return fetchAllowance(rpcProvider, packagePath, owner, spender);
    };

    const makeMessagesRequests = {
      caller: request.recipient,
      positions: request.positions,
    };
    const txMessages = await makeClaimAllMessageWithApproves(makeMessagesRequests, getAllowance);

    const txDoc = await transactionService.createDocument({ messages: txMessages });
    await transactionService.createTransaction(txDoc);

    const { currentGasInfo, networkFee } = await estimateNetworkFee(txDoc);
    const requestWithGasInfo: ClaimAllRequest = {
      ...request,
      gasFee: networkFee?.amount,
      gasUsed: getGasUsed(currentGasInfo).toString(),
    };

    return positionRepository.sendClaimAll(requestWithGasInfo).catch(() => null);
  };

  const claimAll = useCallback(
    async ({ rpcProvider }: { rpcProvider: GnoProvider | null }) => {
      const address = account?.address;
      if (!address) {
        return null;
      }

      const claimablePositions = positions.filter(
        position =>
          position.rewards.reduce(
            (accum, currReward) =>
              BigNumber(accum)
                .plus(Number(currReward.claimableAmount ?? "0"))
                .toNumber(),
            0,
          ) > 0,
      );

      const walletType = walletClient?.getWalletType();

      const request: ClaimAllRequest = { positions: claimablePositions, recipient: address };

      return await (walletType === "ADENA"
        ? buildAdenaWalletClaimAllAction(request)
        : buildSocialWalletClaimAllAction(rpcProvider, request));
    },
    [walletClient, account?.address, positionRepository, positions],
  );

  const buildAdenaWalletClaimAction = async (request: ClaimRequest) => {
    return positionRepository.sendClaim(request).catch(() => null);
  };

  const buildSocialWalletClaimAction = async (rpcProvider: GnoProvider | null, request: ClaimRequest) => {
    if (!rpcProvider) {
      console.log("Claim: ", new CommonError("FAILED_INITIALIZE_GNO_PROVIDER"));
      return null;
    }

    const getAllowance = (packagePath: string, owner: string, spender: string) => {
      return fetchAllowance(rpcProvider, packagePath, owner, spender);
    };

    const makeMessagesRequests = {
      caller: request.recipient,
      position: request.position,
    };

    const txMessages = await makeClaimMessageWithApproves(makeMessagesRequests, getAllowance);

    const txDoc = await transactionService.createDocument({ messages: txMessages });
    await transactionService.createTransaction(txDoc);

    const { currentGasInfo, networkFee } = await estimateNetworkFee(txDoc);
    const requestWithGasInfo: ClaimRequest = {
      ...request,
      gasFee: networkFee?.amount,
      gasUsed: getGasUsed(currentGasInfo).toString(),
    };

    return positionRepository.sendClaim(requestWithGasInfo).catch(() => null);
  };

  const claim = useCallback(
    async (rpcProvider: GnoProvider | null, position: PoolPositionModel) => {
      const address = account?.address;
      if (!address) {
        return null;
      }

      const walletType = walletClient?.getWalletType();

      const request: ClaimRequest = { position: position, recipient: address };

      return await (walletType === "ADENA"
        ? buildAdenaWalletClaimAction(request)
        : buildSocialWalletClaimAction(rpcProvider, request));
    },
    [walletClient, account?.address, positionRepository],
  );

  return {
    claimAll,
    claim,
  };
};
