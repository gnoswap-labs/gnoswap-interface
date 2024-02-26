import BigNumber from "bignumber.js";
import { SCANNER_URL } from "@common/values";
import { INoticeContent } from "@components/common/notice/NoticeToast";
import { CommonState } from "@states/index";
import { makeRandomId } from "@utils/common";
import { useAtom } from "jotai";
import { useCallback, useContext } from "react";
import {
  INoticeOptions,
  NoticeContext,
  TNoticeType,
} from "src/context/NoticeContext";
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

function makeScannerURL(hash: string) {
  return `${SCANNER_URL}/transactions/details?txhash=${hash}`;
}

export function makeBroadcastClaimMessage(
  type: TNoticeType,
  data: {
    tokenASymbol: string;
    tokenBSymbol: string;
    tokenAAmount: string;
    tokenBAmount: string;
  },
  hash?: string,
): INoticeContent {
  function description() {
    switch (type) {
      case "pending":
        return `Claiming ${data.tokenAAmount} ${data.tokenASymbol} and ${data.tokenBAmount} ${data.tokenBSymbol}`;
      case "success":
        return `Claimed ${data.tokenAAmount} ${data.tokenASymbol} and ${data.tokenBAmount} ${data.tokenBSymbol}`;
      case "error":
        return `Failed to Claim ${data.tokenAAmount} ${data.tokenASymbol} and ${data.tokenBAmount} ${data.tokenBSymbol}`;
    }
  }
  return {
    title: "Swap",
    description: description(),
    scannerUrl: hash ? makeScannerURL(hash) : "",
  };
}

export function makeBroadcastSwapMessage(
  type: TNoticeType,
  data: {
    tokenASymbol: string;
    tokenBSymbol: string;
    tokenAAmount: string;
    tokenBAmount: string;
  },
  hash?: string,
): INoticeContent {
  function description() {
    const tokenA = BigNumber(data.tokenAAmount).toFormat(2);
    const tokenB = BigNumber(data.tokenBAmount).toFormat(2);
    switch (type) {
      case "pending":
        return `Swapping ${tokenA} ${data.tokenASymbol} and ${tokenB} ${data.tokenBSymbol}`;
      case "success":
        return `Swapped ${tokenA} ${data.tokenASymbol} and ${tokenB} ${data.tokenBSymbol}`;
      case "error":
        return `Failed to swap ${tokenA} ${data.tokenASymbol} and ${tokenB} ${data.tokenBSymbol}`;
    }
  }
  return {
    title: "Swap",
    description: description(),
    scannerUrl: hash ? makeScannerURL(hash) : "",
  };
}

export function makeBroadcastStakingMessage(
  type: TNoticeType,
  data: {
    tokenASymbol: string;
    tokenBSymbol: string;
    tokenAAmount: string;
    tokenBAmount: string;
  },
  hash?: string,
): INoticeContent {
  function description() {
    switch (type) {
      case "pending":
        return `Staking <span>${data.tokenAAmount}</span> <span>${data.tokenASymbol}</span> and <span>${data.tokenBAmount}</span> <span>${data.tokenBSymbol}</span>`;
      case "success":
        return `Staked <span>${data.tokenAAmount}</span> <span>${data.tokenASymbol}</span> and <span>${data.tokenBAmount}</span> <span>${data.tokenBSymbol}</span>`;
      case "error":
        return `Failed to stake <span>${data.tokenAAmount}</span> <span>${data.tokenASymbol}</span> and <span>${data.tokenBAmount}</span> <span>${data.tokenBSymbol}</span>`;
    }
  }
  return {
    title: "Stake",
    description: description(),
    scannerUrl: hash ? makeScannerURL(hash) : "",
  };
}

export function makeBroadcastUnStakingMessage(
  type: TNoticeType,
  data: {
    tokenASymbol: string;
    tokenBSymbol: string;
    tokenAAmount: string;
    tokenBAmount: string;
  },
  hash?: string,
): INoticeContent {
  function description() {
    switch (type) {
      case "pending":
        return `Unstaking <span>${data.tokenAAmount}</span> <span>${data.tokenASymbol}</span> and <span>${data.tokenBAmount}</span> <span>${data.tokenBSymbol}</span>`;
      case "success":
        return `Unstaked <span>${data.tokenAAmount}</span> <span>${data.tokenASymbol}</span> and <span>${data.tokenBAmount}</span> <span>${data.tokenBSymbol}</span>`;
      case "error":
        return `Failed to unstake <span>${data.tokenAAmount}</span> <span>${data.tokenASymbol}</span> and <span>${data.tokenBAmount}</span> <span>${data.tokenBSymbol}</span>`;
    }
  }
  return {
    title: "Unstake",
    description: description(),
    scannerUrl: hash ? makeScannerURL(hash) : "",
  };
}

export function makeBroadcastRemoveMessage(
  type: TNoticeType,
  data: {
    tokenASymbol: string;
    tokenBSymbol: string;
    tokenAAmount: string;
    tokenBAmount: string;
  },
  hash?: string,
): INoticeContent {
  function description() {
    switch (type) {
      case "pending":
        return `Adding <span>${data.tokenAAmount}</span> <span>${data.tokenASymbol}</span> and <span>${data.tokenBAmount}</span> <span>${data.tokenBSymbol}</span>`;
      case "success":
        return `Added <span>${data.tokenAAmount}</span> <span>${data.tokenASymbol}</span> and <span>${data.tokenBAmount}</span> <span>${data.tokenBSymbol}</span>`;
      case "error":
        return `Failed to add <span>${data.tokenAAmount}</span> <span>${data.tokenASymbol}</span> and <span>${data.tokenBAmount}</span> <span>${data.tokenBSymbol}</span>`;
    }
  }
  return {
    title: "Remove",
    description: description(),
    scannerUrl: hash ? makeScannerURL(hash) : "",
  };
}

export function makeBroadcastIncentivizeMessage(
  type: TNoticeType,
  data: {
    tokenAmount?: string;
    tokenSymbol?: string;
    hash?: any;
  },
): INoticeContent {
  function description() {
    switch (type) {
      case "pending":
        return `Adding <span>${data.tokenAmount}</span> <span>${data.tokenSymbol}</span> as incentives`;
      case "success":
        return `Added <span>${data.tokenAmount}</span> <span>${data.tokenSymbol}</span> as incentives`;
      case "error":
        return `Failed to add <span>${data.tokenAmount}</span> <span>${data.tokenSymbol}</span> as incentives`;
    }
  }
  return {
    title: "Incentivize",
    description: description(),
    scannerUrl: data?.hash ? makeScannerURL(data?.hash) : "",
  };
}

export function makeBroadcastWithdrawMessage(
  type: TNoticeType,
  data: {
    tokenSymbol: string;
    tokenAmount: string;
  },
  hash?: string,
): INoticeContent {
  function description() {
    switch (type) {
      case "pending":
        return `Sending <span>${data.tokenAmount}</span> <span>${data.tokenSymbol}</span>`;
      case "success":
        return `Sent <span>${data.tokenAmount}</span> <span>${data.tokenSymbol}</span>`;
      case "error":
        return `Failed to send <span>${data.tokenAmount}</span> <span>${data.tokenSymbol}</span>`;
    }
  }
  return {
    title: "Withdraw",
    description: description(),
    scannerUrl: hash ? makeScannerURL(hash) : "",
  };
}

export function makeBroadcastAddLiquidityMessage(
  type: TNoticeType,
  data: {
    tokenASymbol: string;
    tokenBSymbol: string;
    tokenAAmount: string;
    tokenBAmount: string;
  },
  hash?: string,
): INoticeContent {
  function description() {
    switch (type) {
      case "pending":
        return `Adding <span>${data.tokenAAmount}</span> <span>${data.tokenASymbol}</span> and <span>${data.tokenBAmount}</span> <span>${data.tokenBSymbol}</span>`;
      case "success":
        return `Added <span>${data.tokenAAmount}</span> <span>${data.tokenASymbol}</span> and <span>${data.tokenBAmount}</span> <span>${data.tokenBSymbol}</span>`;
      case "error":
        return `Failed to add <span>${data.tokenAAmount}</span> <span>${data.tokenASymbol}</span> and <span>${data.tokenBAmount}</span> <span>${data.tokenBSymbol}</span>`;
    }
  }
  return {
    title: "Add Liquidity",
    description: description(),
    scannerUrl: hash ? makeScannerURL(hash) : "",
  };
}

function makeNoticeConfig(type: TNoticeType): INoticeOptions {
  const timeout = 50000;
  return {
    id: makeRandomId(),
    type,
    closeable: true,
    timeout,
  };
}

export const useBroadcastHandler = () => {
  const { setNotice, onCloseNotice } = useContext(NoticeContext);
  const { openModal, closeModal } = useTransactionConfirmModal();
  const [, setTransactionModalData] = useAtom(CommonState.transactionModalData);

  const broadcastLoading = useCallback(
    (content?: INoticeContent) => {
      setTransactionModalData({
        status: "loading",
        description: content?.description || null,
        scannerURL: content?.scannerUrl || null,
      });
      openModal();
    },
    [openModal, setTransactionModalData],
  );

  const broadcastSuccess = useCallback(
    (content?: INoticeContent, callback?: () => void) => {
      setTransactionModalData({
        status: "success",
        description: content?.description || null,
        scannerURL: content?.scannerUrl || null,
        callback,
      });
      setNotice(content, makeNoticeConfig("success"));
    },
    [setNotice, setTransactionModalData],
  );

  const broadcastPending = useCallback(
    (content?: INoticeContent) => {
      setNotice(content, makeNoticeConfig("pending"));
    },
    [setNotice],
  );

  const broadcastError = useCallback(
    (content?: INoticeContent, callback?: () => void) => {
      setTransactionModalData({
        status: "error",
        description: content?.description || null,
        scannerURL: content?.scannerUrl || null,
        callback,
      });
      setNotice(content, makeNoticeConfig("error"));
    },
    [setNotice, setTransactionModalData],
  );

  const broadcastRejected = useCallback(
    (content?: INoticeContent, callback?: () => void, isHiddenReject?: boolean) => {
      setTransactionModalData({
        status: "rejected",
        description: content?.description || null,
        scannerURL: content?.scannerUrl || null,
        callback,
      });
      !isHiddenReject && setNotice(content, makeNoticeConfig("error"));
    },
    [setNotice, setTransactionModalData],
  );

  const clearBroadcast = useCallback(() => {
    onCloseNotice();
    closeModal();
  }, [onCloseNotice]);

  return {
    broadcastLoading,
    broadcastSuccess,
    broadcastPending,
    broadcastError,
    clearBroadcast,
    broadcastRejected,
  };
};
