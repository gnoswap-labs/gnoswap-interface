import React, { useCallback, useMemo } from "react";
import SubmitPositionModal from "@components/stake/submit-position-modal/SubmitPositionModal";
import { useClearModal } from "@hooks/common/use-clear-modal";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { useWallet } from "@hooks/wallet/use-wallet";
import { useRouter } from "next/router";
import { makeBroadcastStakingMessage, useBroadcastHandler } from "@hooks/common/use-broadcast-handler";
import { ERROR_VALUE } from "@common/errors/adena";
import { useTokenData } from "@hooks/token/use-token-data";
import { makeDisplayTokenAmount } from "@utils/token-utils";

interface SubmitPositionModalContainerProps {
  positions: PoolPositionModel[];
}

const SubmitPositionModalContainer = ({
  positions
}: SubmitPositionModalContainerProps) => {
  const { account } = useWallet();
  const { broadcastRejected, broadcastSuccess, broadcastPending, broadcastError } = useBroadcastHandler();
  const { positionRepository } = useGnoswapContext();
  const router = useRouter();
  const clearModal = useClearModal();
  const { tokenPrices } = useTokenData();

  const pooledTokenInfos = useMemo(() => {
    if (positions.length === 0) {
      return [];
    }
    const tokenA = positions[0].pool.tokenA;
    const tokenB = positions[0].pool.tokenB;
    const pooledTokenAAmount = positions.reduce((accum, position) => accum + position.token0Balance, 0n);
    const pooledTokenBAmount = positions.reduce((accum, position) => accum + position.token1Balance, 0n);
    const tokenAAmount = makeDisplayTokenAmount(tokenA, Number(pooledTokenAAmount)) || 0;
    const tokenBAmount = makeDisplayTokenAmount(tokenB, Number(pooledTokenBAmount)) || 0;
    return [{
      token: tokenA,
      amount: tokenAAmount,
    }, {
      token: tokenB,
      amount: tokenBAmount,
    }];
  }, [positions, tokenPrices]);
  const close = useCallback(() => {
    clearModal();
  }, [clearModal]);

  const onSubmit = useCallback(async () => {
    const address = account?.address;
    if (!address) {
      return null;
    }
    const lpTokenIds = positions.map(position => position.id);
    const result = await positionRepository.stakePositions({
      lpTokenIds,
      caller: address
    }).catch(() => null);
    if (result) {
      if (result.code === 0) {
        broadcastPending();
        setTimeout(() => {
          broadcastSuccess(makeBroadcastStakingMessage("success", {
            tokenASymbol: pooledTokenInfos?.[0]?.token?.symbol,
            tokenBSymbol: pooledTokenInfos?.[1]?.token?.symbol,
            tokenAAmount: pooledTokenInfos?.[0]?.amount.toLocaleString("en-US", { maximumFractionDigits: 6}),
            tokenBAmount: pooledTokenInfos?.[1]?.amount.toLocaleString("en-US", { maximumFractionDigits: 6})
          }));
          
        }, 1000);
        const pathName = router.pathname;
        if (pathName === "/earn/stake") {
          router.push("/earn?back=q");
        } else {
          router.push(router.asPath.replace("/stake", ""));
        }
      } else if (result.code === 4000 && result.type !== ERROR_VALUE.TRANSACTION_REJECTED.type) {
        broadcastError(makeBroadcastStakingMessage("error", {
          tokenASymbol: pooledTokenInfos?.[0]?.token?.symbol,
          tokenBSymbol: pooledTokenInfos?.[1]?.token?.symbol,
          tokenAAmount: pooledTokenInfos?.[0]?.amount.toLocaleString("en-US", { maximumFractionDigits: 6}),
          tokenBAmount: pooledTokenInfos?.[1]?.amount.toLocaleString("en-US", { maximumFractionDigits: 6})
        }));
      } else {
        broadcastRejected(makeBroadcastStakingMessage("error", {
          tokenASymbol: pooledTokenInfos?.[0]?.token?.symbol,
          tokenBSymbol: pooledTokenInfos?.[1]?.token?.symbol,
          tokenAAmount: pooledTokenInfos?.[0]?.amount.toLocaleString("en-US", { maximumFractionDigits: 6}),
          tokenBAmount: pooledTokenInfos?.[1]?.amount.toLocaleString("en-US", { maximumFractionDigits: 6})
        }));
      }
    }
    return result;
  }, [account?.address, clearModal, positionRepository, positions, router]);

  return <SubmitPositionModal positions={positions} close={close} onSubmit={onSubmit} />;
};

export default SubmitPositionModalContainer;
