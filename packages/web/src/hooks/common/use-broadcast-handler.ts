import { useAtom } from "jotai";
import { useCallback } from "react";

import { CommonState } from "@states/index";

import { WalletResponse } from "@common/clients/wallet-client/protocols";
import { ERROR_VALUE } from "@common/errors/adena";
import { DexEventType } from "@repositories/common";
import { useMessage } from "./use-message";
import { SnackbarContent, useSnackbar } from "./use-snackbar";
import { useTransactionConfirmModal } from "./use-transaction-confirm-modal";
import { useTransactionEventStore } from "./use-transaction-event-store";

/**
 * PENDING
 * - Swap: Swapping n GNOT and n GNOT
 * - Add Liquidity: Adding n GNOT and n GNOT
 * - Remove Liquidity: Removing n GNOT and n GNOT
 * - Stake Position: Staking n GNOT and n GNOT
 * - Unstake Position: Unstaking n GNOT and n GNOT
 * - Incentivize: Adding n GNOT and n GNOT as incentives
 * - Claim: Claiming n GNOT and n GNOT
 * - Withdraw: Sending n GNOT
 *
 * SUCCESS
 * - Swap: Swapped n GNOT and n GNOT
 * - Add Liquidity: Added n GNOT and n GNOT
 * - Remove Liquidity: Removed n GNOT and n GNOT
 * - Stake Position: Staked n GNOT and n GNOT
 * - Unstake Position: Unstaked n GNOT and n GNOT
 * - Incentivize: Added n GNOT and n GNOT as incentives
 * - Claim: Claimed n GNOT and n GNOT
 * - Withdraw: Sent n GNOT
 *
 * FAIL
 * - Swap: Failed to swap n GNOT and n GNOT
 * - Add Liquidity: Failed to add n GNOT and n GNOT
 * - Remove Liquidity: Failed to remove n GNOT and n GNOT
 * - Stake Position: Failed to stake n GNOT and n GNOT
 * - Unstake Position: Failed to unstake n GNOT and n GNOT
 * - Incentivize: Failed to add n GNOT and n GNOT as incentives
 * - Claim: Failed to claim n GNOT and n GNOT
 * - Withdraw: Failed to Send n GNOT
 */

export const useBroadcastHandler = () => {
  const { enqueue, clear } = useSnackbar();
  const { openModal, closeModal } = useTransactionConfirmModal();
  const { getMessage } = useMessage();
  const [, setTransactionModalData] = useAtom(CommonState.transactionModalData);
  const { enqueueEvent } = useTransactionEventStore();

  const broadcastLoading = useCallback(
    (content?: SnackbarContent) => {
      setTransactionModalData({
        status: "loading",
        description: content?.description || null,
        txHash: content?.txHash || null,
      });
      openModal();
    },
    [openModal, setTransactionModalData],
  );

  const broadcastSuccess = useCallback(
    (content?: SnackbarContent, callback?: () => void) => {
      setTransactionModalData({
        status: "success",
        description: content?.description || null,
        txHash: content?.txHash || null,
        callback,
      });
      if (content?.txHash) {
      }
      // enqueue(content, makeNoticeConfig("success"));
    },
    [enqueue, setTransactionModalData],
  );

  const broadcastError = useCallback(
    (content?: SnackbarContent, callback?: () => void) => {
      setTransactionModalData({
        status: "error",
        description: content?.description || null,
        txHash: content?.txHash || null,
        callback,
      });
    },
    [setTransactionModalData],
  );

  const broadcastRejected = useCallback(
    (content?: SnackbarContent, callback?: () => void) => {
      setTransactionModalData({
        status: "rejected",
        description: content?.description || null,
        txHash: content?.txHash || null,
        callback,
      });
    },
    [setTransactionModalData],
  );

  const clearBroadcast = useCallback(() => {
    clear();
    closeModal();
  }, [clear]);

  const processTx = (
    func: () => Promise<
      WalletResponse<{
        hash: string;
      }>
    >,
    eventType: DexEventType,
    messageData: {
      tokenASymbol?: string;
      tokenBSymbol?: string;
      tokenAAmount?: string;
      tokenBAmount?: string;
      target?: string;
      memo0?: string;
    },
    formatData: (result: string[] | null) => {
      tokenASymbol?: string;
      tokenBSymbol?: string;
      tokenAAmount?: string;
      tokenBAmount?: string;
      target?: string;
      memo0?: string;
    },
    emitCallback?: () => Promise<void>,
    updateCallback?: () => Promise<void>,
  ) => {
    broadcastLoading(getMessage(eventType, "pending", messageData));
    openModal();

    func()
      .then(response => {
        if (
          response?.code === 0 ||
          response?.code === ERROR_VALUE.TRANSACTION_FAILED.status
        ) {
          enqueueEvent({
            txHash: response?.data?.hash,
            action: eventType,
            formatData,
            visibleEmitResult: true,
            onUpdate: async () => {
              if (updateCallback) await updateCallback();
            },
            onEmit: async () => {
              if (emitCallback) await emitCallback();
            },
          });
        }

        if (response?.code === 0) {
          openModal();
          broadcastSuccess(
            getMessage(eventType, "success", messageData, response.data?.hash),
          );
        } else if (
          response?.code === ERROR_VALUE.TRANSACTION_REJECTED.status // 4000
        ) {
          broadcastRejected(getMessage(eventType, "error", messageData));
          openModal();
        } else {
          broadcastError(
            getMessage(eventType, "error", messageData, response?.data?.hash),
          );
          openModal();
        }
      })
      .catch(e => {
        console.warn(`Something wrong in ${eventType}: ${e}`);
      });
  };

  return {
    broadcastLoading,
    broadcastSuccess,
    broadcastError,
    clearBroadcast,
    broadcastRejected,
    processTx,
  };
};
