import { GnoProvider } from "@common/clients/gno-provider/gno-provider";
import { fetchAllowance } from "@common/clients/wallet-client/transaction-messages";
import { CommonError } from "@common/errors";
import { WRAPPED_GNOT_PATH } from "@constants/environment.constant";
import { useNetworkFee } from "@hooks/common/use-network-fee";
import { getGasUsed } from "@hooks/gas";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { PositionModel } from "@models/position/position-model";
import { makeClaimAllMessageWithApprovesByIds, makeClaimMessageWithApproves } from "@repositories/position/position.message";
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
      swapFeeTokenPaths: request.swapFeeTokenPaths,
      hasGnotStakingReward: request.hasGnotStakingReward,
      positionsWithSwapFee: request.positionsWithSwapFee,
      positionsWithStakingReward: request.positionsWithStakingReward,
    };
    const txMessages = await makeClaimAllMessageWithApprovesByIds(makeMessagesRequests, getAllowance);

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
    async ({ rpcProvider, input }: { rpcProvider: GnoProvider | null; input: ClaimAllInput }) => {
      const address = account?.address;
      if (!address) {
        return null;
      }

      if (input.positionsWithSwapFee.length === 0 && input.positionsWithStakingReward.length === 0) {
        return null;
      }

      const walletType = walletClient?.getWalletType();

      const request: ClaimAllRequest = {
        swapFeeTokenPaths: input.swapFeeTokenPaths,
        hasGnotStakingReward: input.hasGnotStakingReward,
        positionsWithSwapFee: input.positionsWithSwapFee,
        positionsWithStakingReward: input.positionsWithStakingReward,
        recipient: address,
      };

      return await (walletType === "ADENA"
        ? buildAdenaWalletClaimAllAction(request)
        : buildSocialWalletClaimAllAction(rpcProvider, request));
    },
    [walletClient, account?.address, positionRepository],
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
