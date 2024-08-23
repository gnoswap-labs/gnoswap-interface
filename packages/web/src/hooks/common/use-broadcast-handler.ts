import { useAtom } from "jotai";
import { useCallback } from "react";

import { CommonState } from "@states/index";

import { SnackbarContent, useSnackbar } from "./use-snackbar";
import { useTransactionConfirmModal } from "./use-transaction-confirm-modal";

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
  const [, setTransactionModalData] = useAtom(CommonState.transactionModalData);

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

  return {
    broadcastLoading,
    broadcastSuccess,
    broadcastError,
    clearBroadcast,
    broadcastRejected,
  };
};
