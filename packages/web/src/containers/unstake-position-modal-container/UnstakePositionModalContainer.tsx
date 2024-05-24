import React, { useCallback } from "react";
import UnstakePositionModal from "@components/unstake/unstake-position-modal/UnstakePositionModal";
import { useClearModal } from "@hooks/common/use-clear-modal";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { useWallet } from "@hooks/wallet/use-wallet";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useRouter } from "next/router";
import { makeBroadcastUnStakingMessage, useBroadcastHandler } from "@hooks/common/use-broadcast-handler";
import { useUnstakeData } from "@hooks/stake/use-unstake-data";
import { ERROR_VALUE } from "@common/errors/adena";
import { useTransactionConfirmModal } from "@hooks/common/use-transaction-confirm-modal";

interface UnstakePositionModalContainerProps {
  positions: PoolPositionModel[];
}

const UnstakePositionModalContainer = ({
  positions
}: UnstakePositionModalContainerProps) => {
  const { account } = useWallet();
  const { positionRepository } = useGnoswapContext();
  const router = useRouter();
  const clearModal = useClearModal();
  const { broadcastRejected, broadcastSuccess, broadcastPending, broadcastError, broadcastLoading } = useBroadcastHandler();
  const { pooledTokenInfos } = useUnstakeData({ positions });
  const { openModal } = useTransactionConfirmModal({
    confirmCallback: () => router.push(router.asPath.replace("/unstake", ""))
  });

  const close = useCallback(() => {
    clearModal();
  }, [clearModal]);

  const onSubmit = useCallback(async () => {
    const address = account?.address;
    if (!address) {
      return null;
    }
    broadcastLoading(makeBroadcastUnStakingMessage("pending", {
      tokenASymbol: pooledTokenInfos?.[0]?.token?.symbol,
      tokenBSymbol: pooledTokenInfos?.[1]?.token?.symbol,
      tokenAAmount: pooledTokenInfos?.[0]?.amount.toLocaleString("en-US", { maximumFractionDigits: 6 }),
      tokenBAmount: pooledTokenInfos?.[1]?.amount.toLocaleString("en-US", { maximumFractionDigits: 6 })
    }));
    const result = await positionRepository.unstakePositions({
      positions,
      caller: address
    }).catch(() => null);
    if (result) {
      if (result.code === 0) {
        broadcastPending();
        setTimeout(() => {
          broadcastSuccess(makeBroadcastUnStakingMessage("success", {
            tokenASymbol: pooledTokenInfos?.[0]?.token?.symbol,
            tokenBSymbol: pooledTokenInfos?.[1]?.token?.symbol,
            tokenAAmount: pooledTokenInfos?.[0]?.amount.toLocaleString("en-US", { maximumFractionDigits: 6 }),
            tokenBAmount: pooledTokenInfos?.[1]?.amount.toLocaleString("en-US", { maximumFractionDigits: 6 })
          }));
          openModal();
          // router.push(router.asPath.replace("/unstake", ""));
        }, 1000);
      } else if (result.code === 4000 && result.type !== ERROR_VALUE.TRANSACTION_REJECTED.type) {
        broadcastPending();
        setTimeout(() => {
          broadcastError(makeBroadcastUnStakingMessage("error", {
            tokenASymbol: pooledTokenInfos?.[0]?.token?.symbol,
            tokenBSymbol: pooledTokenInfos?.[1]?.token?.symbol,
            tokenAAmount: pooledTokenInfos?.[0]?.amount.toLocaleString("en-US", { maximumFractionDigits: 6 }),
            tokenBAmount: pooledTokenInfos?.[1]?.amount.toLocaleString("en-US", { maximumFractionDigits: 6 })
          }));
          openModal();
        }, 1000);
      } else {
        broadcastRejected(makeBroadcastUnStakingMessage("error", {
          tokenASymbol: pooledTokenInfos?.[0]?.token?.symbol,
          tokenBSymbol: pooledTokenInfos?.[1]?.token?.symbol,
          tokenAAmount: pooledTokenInfos?.[0]?.amount.toLocaleString("en-US", { maximumFractionDigits: 6 }),
          tokenBAmount: pooledTokenInfos?.[1]?.amount.toLocaleString("en-US", { maximumFractionDigits: 6 })
        }));
        openModal();
      }
    }
    // if (result) {
    //   clearModal();
    //   router.push(router.asPath.replace("/unstake", ""));
    // }
    return result;
  }, [account?.address, positionRepository, positions, router]);

  return <UnstakePositionModal positions={positions} close={close} onSubmit={onSubmit} />;
};

export default UnstakePositionModalContainer;
