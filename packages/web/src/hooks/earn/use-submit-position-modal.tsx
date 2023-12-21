import SubmitPositionModalContainer from "@containers/submit-position-modal-container/SubmitPositionModalContainer";
import {
  makeBroadcastStakeMessage,
  useBroadcastHandler,
} from "@hooks/common/use-broadcast-handler";
import { useClearModal } from "@hooks/common/use-clear-modal";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useWallet } from "@hooks/wallet/use-wallet";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { CommonState } from "@states/index";
import BigNumber from "bignumber.js";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";

export interface Props {
  positions: PoolPositionModel[];
  selectedIds: string[];
}

export type StakePositions = {
  code: number;
  hash: string;
};

export const useSubmitPositionModal = ({ positions, selectedIds }: Props) => {
  const [, setOpenedModal] = useAtom(CommonState.openedModal);
  const [, setModalContent] = useAtom(CommonState.modalContent);

  const {
    broadcastLoading,
    broadcastRejected,
    broadcastSuccess,
    broadcastPending,
    broadcastError,
  } = useBroadcastHandler();
  const { account } = useWallet();
  const { positionRepository } = useGnoswapContext();
  const router = useRouter();
  const clearModal = useClearModal();

  const selectedPositions = useMemo(() => {
    return positions.filter(position => selectedIds.includes(position.id));
  }, [positions, selectedIds]);

  const close = useCallback(() => {
    clearModal();
  }, [clearModal]);

  const moveToBack = useCallback(() => {
    close();
    router.back();
  }, [close, router]);

  const onSubmit = useCallback(() => {
    const address = account?.address;
    if (!address || !selectedPositions || selectedPositions.length === 0) {
      return null;
    }

    const [position] = selectedPositions;

    const {
      pool: { tokenA, tokenB },
      token0Balance,
      token1Balance,
    } = position ?? {};

    const lpTokenIds = positions.map(position => position.id);

    const broadcastPayload = {
      tokenASymbol: tokenA.symbol,
      tokenBSymbol: tokenB.symbol,
      tokenAAmount: BigNumber(token0Balance.toString())
        .shiftedBy(-tokenA.decimals)
        ?.toString(),
      tokenBAmount: BigNumber(token1Balance.toString())
        .shiftedBy(-tokenA.decimals)
        ?.toString(),
    };
    broadcastLoading(makeBroadcastStakeMessage("pending", broadcastPayload));

    positionRepository
      .stakePositions({
        lpTokenIds,
        caller: address,
      })
      .then(result => {
        if (result) {
          if (result.code === 0) {
            broadcastPending();
            setTimeout(() => {
              broadcastSuccess(
                makeBroadcastStakeMessage("success", broadcastPayload),
                moveToBack,
              );
            }, 500);
            return true;
          } else if (result.code === 4000) {
            broadcastRejected(
              makeBroadcastStakeMessage("error", broadcastPayload),
            );
            return true;
          }
        }
        return false;
      })
      .catch(() => false)
      .then(broadcasted => {
        if (broadcasted) {
          return;
        }
        broadcastError(makeBroadcastStakeMessage("error", broadcastPayload));
      });
  }, [
    account?.address,
    broadcastError,
    broadcastLoading,
    broadcastPending,
    broadcastRejected,
    broadcastSuccess,
    moveToBack,
    positionRepository,
    positions,
    selectedPositions,
  ]);

  const openModal = useCallback(() => {
    setOpenedModal(true);
    setModalContent(
      <SubmitPositionModalContainer
        positions={selectedPositions}
        onSubmit={onSubmit}
        close={close}
      />,
    );
  }, [close, onSubmit, selectedPositions, setModalContent, setOpenedModal]);

  return {
    openModal,
  };
};
