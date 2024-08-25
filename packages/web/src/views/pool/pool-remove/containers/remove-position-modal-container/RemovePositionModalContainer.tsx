import { useCallback, useMemo } from "react";

import { ERROR_VALUE } from "@common/errors/adena";
import { GNOT_TOKEN, WUGNOT_TOKEN } from "@common/values/token-constant";
import { useBroadcastHandler } from "@hooks/common/use-broadcast-handler";
import { useClearModal } from "@hooks/common/use-clear-modal";
import useRouter from "@hooks/common/use-custom-router";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useMessage } from "@hooks/common/use-message";
import { useTransactionConfirmModal } from "@hooks/common/use-transaction-confirm-modal";
import { useWallet } from "@hooks/wallet/use-wallet";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { TokenModel } from "@models/token/token-model";
import { DexEvent } from "@repositories/common";
import { checkGnotPath } from "@utils/common";
import { formatPoolPairAmount } from "@utils/new-number-utils";

import { usePositionsRewards } from "../../../common/hooks/use-positions-rewards";
import RemovePositionModal from "../../components/remove-position-modal/RemovePositionModal";
import { useTransactionEventStore } from "@hooks/common/use-transaction-event-store";
import { useGetPoolList } from "@query/pools";
import { useGetPositionsByAddress } from "@query/positions";

interface RemovePositionModalContainerProps {
  selectedPositions: PoolPositionModel[];
  allPosition: PoolPositionModel[];
  isGetWGNOT: boolean;
}

const RemovePositionModalContainer = ({
  selectedPositions,
  allPosition,
  isGetWGNOT,
}: RemovePositionModalContainerProps) => {
  const { account } = useWallet();
  const { positionRepository } = useGnoswapContext();

  const router = useRouter();
  const clearModal = useClearModal();
  const {
    broadcastRejected,
    broadcastSuccess,
    broadcastLoading,
    broadcastError,
  } = useBroadcastHandler();
  const { enqueueEvent } = useTransactionEventStore();

  // Refetch functions
  const { refetch: refetchPools } = useGetPoolList();
  const { refetch: refetchPositions } = useGetPositionsByAddress();
  const { pooledTokenInfos, unclaimedFees } = usePositionsRewards({
    positions: selectedPositions,
  });

  const onCloseConfirmTransactionModal = useCallback(() => {
    clearModal();
    router.push(router.asPath.replace("/remove", ""));
  }, [clearModal, router]);

  const { openModal: openTransactionConfirmModal } = useTransactionConfirmModal(
    {
      closeCallback: onCloseConfirmTransactionModal,
    },
  );

  const { getMessage } = useMessage();

  const gnotToken = useMemo(
    () =>
      selectedPositions.find(item => item.pool.tokenA.path === GNOT_TOKEN.path)
        ?.pool.tokenA ||
      selectedPositions.find(item => item.pool.tokenB.path === GNOT_TOKEN.path)
        ?.pool.tokenB,
    [selectedPositions],
  );

  const gnotAmount = useMemo(() => {
    const pooledGnotTokenAmount = pooledTokenInfos.find(
      item => item.token.path === gnotToken?.path,
    )?.amount;
    const unclaimedGnotTokenAmount = unclaimedFees.find(
      item => item.token.path === gnotToken?.path,
    )?.amount;

    return (
      Number(pooledGnotTokenAmount || 0) + Number(unclaimedGnotTokenAmount || 0)
    );
  }, [gnotToken?.path, pooledTokenInfos, unclaimedFees]);

  const willWrap = useMemo(
    () => isGetWGNOT && !!gnotToken && !!gnotAmount,
    [gnotAmount, gnotToken, isGetWGNOT],
  );

  const tokenTransform = useCallback(
    (token: TokenModel) => {
      if (token.path === GNOT_TOKEN.path) {
        if (willWrap) {
          return WUGNOT_TOKEN;
        }
      }

      return token;
    },
    [willWrap],
  );

  const onSubmit = useCallback(async () => {
    const address = account?.address;
    if (!address) {
      return null;
    }
    const lpTokenIds = selectedPositions.map(position =>
      position.id.toString(),
    );
    const approveTokenPaths = [
      ...new Set(
        selectedPositions.flatMap(position => [
          position.pool.tokenA.wrappedPath ||
            checkGnotPath(position.pool.tokenA.path),
          position.pool.tokenB.wrappedPath ||
            checkGnotPath(position.pool.tokenB.path),
        ]),
      ),
    ];

    const messageData = {
      tokenASymbol: tokenTransform(pooledTokenInfos?.[0].token).symbol,
      tokenBSymbol: tokenTransform(pooledTokenInfos?.[1]?.token).symbol,
      tokenAAmount: formatPoolPairAmount(pooledTokenInfos?.[0]?.amount, {
        decimals: pooledTokenInfos?.[0].token.decimals,
        isKMB: false,
      }),

      tokenBAmount: formatPoolPairAmount(pooledTokenInfos?.[1]?.amount, {
        decimals: pooledTokenInfos?.[1].token.decimals,
        isKMB: false,
      }),
    };

    broadcastLoading(getMessage(DexEvent.REMOVE, "pending", messageData));

    const result = await positionRepository
      .removeLiquidity({
        lpTokenIds,
        tokenPaths: approveTokenPaths,
        caller: address,
        isGetWGNOT: willWrap,
      })
      .catch(() => null);

    if (result) {
      if (
        result.code === 0 ||
        result.code === ERROR_VALUE.TRANSACTION_FAILED.status
      ) {
        enqueueEvent({
          txHash: result.data?.hash,
          action: DexEvent.ADD,
          formatData: response => {
            if (!response) {
              return messageData;
            }

            return messageData;
          },
          callback: async () => {
            refetchPools();
            refetchPositions();
          },
        });
      }
      if (result.code === 0) {
        setTimeout(async () => {
          broadcastSuccess(
            getMessage(
              DexEvent.REMOVE,
              "success",
              { ...messageData },
              result.data?.hash,
            ),
          );
          openTransactionConfirmModal();
        }, 1000);
      } else if (
        result.code === ERROR_VALUE.TRANSACTION_REJECTED.status // 4000
      ) {
        broadcastError(
          getMessage(DexEvent.REMOVE, "error", { ...messageData }),
        );
        clearModal();
      } else {
        broadcastRejected(
          getMessage(
            DexEvent.REMOVE,
            "error",
            { ...messageData },
            result?.data?.hash,
          ),
        );
      }
    }
  }, [
    account?.address,
    clearModal,
    positionRepository,
    selectedPositions,
    router,
    pooledTokenInfos,
    gnotToken,
    willWrap,
    tokenTransform,
  ]);

  return (
    <RemovePositionModal
      selectedPositions={selectedPositions}
      allPositions={allPosition}
      close={clearModal}
      onSubmit={onSubmit}
    />
  );
};

export default RemovePositionModalContainer;
