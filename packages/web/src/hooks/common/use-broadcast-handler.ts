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
import {
  ERROR_NOTIFICATION_ADD_INCENTIVIZE_MESSAGE_TEMPLATE,
  ERROR_NOTIFICATION_ADD_LIQUIDITY_MESSAGE_TEMPLATE,
  ERROR_NOTIFICATION_CLAIM_MESSAGE_TEMPLATE,
  ERROR_NOTIFICATION_REMOVE_MESSAGE_TEMPLATE,
  ERROR_NOTIFICATION_STAKE_MESSAGE_TEMPLATE,
  ERROR_NOTIFICATION_SWAP_MESSAGE_TEMPLATE,
  ERROR_NOTIFICATION_UNSTAKE_MESSAGE_TEMPLATE,
  ERROR_NOTIFICATION_WITHDRAW_MESSAGE_TEMPLATE,
  PEDING_NOTIFICATION_ADD_INCENTIVIZE_MESSAGE_TEMPLATE,
  PEDING_NOTIFICATION_ADD_LIQUIDITY_MESSAGE_TEMPLATE,
  PEDING_NOTIFICATION_CLAIM_MESSAGE_TEMPLATE,
  PEDING_NOTIFICATION_REMOVE_MESSAGE_TEMPLATE,
  PEDING_NOTIFICATION_STAKE_MESSAGE_TEMPLATE,
  PEDING_NOTIFICATION_SWAP_MESSAGE_TEMPLATE,
  PEDING_NOTIFICATION_UNSTAKE_MESSAGE_TEMPLATE,
  PEDING_NOTIFICATION_WITHDRAW_MESSAGE_TEMPLATE,
  SUCCESS_NOTIFICATION_ADD_INCENTIVIZE_MESSAGE_TEMPLATE,
  SUCCESS_NOTIFICATION_ADD_LIQUIDITY_MESSAGE_TEMPLATE,
  SUCCESS_NOTIFICATION_CLAIM_MESSAGE_TEMPLATE,
  SUCCESS_NOTIFICATION_REMOVE_MESSAGE_TEMPLATE,
  SUCCESS_NOTIFICATION_STAKE_MESSAGE_TEMPLATE,
  SUCCESS_NOTIFICATION_SWAP_MESSAGE_TEMPLATE,
  SUCCESS_NOTIFICATION_UNSTAKE_MESSAGE_TEMPLATE,
  SUCCESS_NOTIFICATION_WITHDRAW_MESSAGE_TEMPLATE,
  mapMessageByTemplate,
  PEDING_NOTIFICATION_WRAP_TOKEN_MESSAGE_TEMPLATE,
  SUCCESS_NOTIFICATION_WRAP_TOKEN_MESSAGE_TEMPLATE,
  ERROR_NOTIFICATION_WRAP_TOKEN_MESSAGE_TEMPLATE,
  ERROR_NOTIFICATION_UNWRAP_TOKEN_MESSAGE_TEMPLATE,
  SUCCESS_NOTIFICATION_UNWRAP_TOKEN_MESSAGE_TEMPLATE,
  PEDING_NOTIFICATION_UNWRAP_TOKEN_MESSAGE_TEMPLATE,
} from "@utils/template";

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
    amount: string;
  },
  hash?: string,
): INoticeContent {
  function description() {
    switch (type) {
      case "pending":
        return mapMessageByTemplate(
          PEDING_NOTIFICATION_CLAIM_MESSAGE_TEMPLATE,
          data,
        );
      case "success":
        return mapMessageByTemplate(
          SUCCESS_NOTIFICATION_CLAIM_MESSAGE_TEMPLATE,
          data,
        );
      case "error":
        return mapMessageByTemplate(
          ERROR_NOTIFICATION_CLAIM_MESSAGE_TEMPLATE,
          data,
        );
    }
  }
  return {
    title: "Claim",
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
    const tokenA = BigNumber(data.tokenAAmount).toFormat();
    const tokenB = BigNumber(data.tokenBAmount).toFormat();
    const request = {
      tokenA,
      tokenB,
      tokenASymbol: data.tokenASymbol,
      tokenBSymbol: data.tokenBSymbol,
    };
    switch (type) {
      case "pending":
        return mapMessageByTemplate(
          PEDING_NOTIFICATION_SWAP_MESSAGE_TEMPLATE,
          request,
        );
      case "success":
        return mapMessageByTemplate(
          SUCCESS_NOTIFICATION_SWAP_MESSAGE_TEMPLATE,
          request,
        );
      case "error":
        return mapMessageByTemplate(
          ERROR_NOTIFICATION_SWAP_MESSAGE_TEMPLATE,
          request,
        );
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
        return mapMessageByTemplate(
          PEDING_NOTIFICATION_STAKE_MESSAGE_TEMPLATE,
          data,
        );
      case "success":
        return mapMessageByTemplate(
          SUCCESS_NOTIFICATION_STAKE_MESSAGE_TEMPLATE,
          data,
        );
      case "error":
        return mapMessageByTemplate(
          ERROR_NOTIFICATION_STAKE_MESSAGE_TEMPLATE,
          data,
        );
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
        return mapMessageByTemplate(
          PEDING_NOTIFICATION_UNSTAKE_MESSAGE_TEMPLATE,
          data,
        );
      case "success":
        return mapMessageByTemplate(
          SUCCESS_NOTIFICATION_UNSTAKE_MESSAGE_TEMPLATE,
          data,
        );
      case "error":
        return mapMessageByTemplate(
          ERROR_NOTIFICATION_UNSTAKE_MESSAGE_TEMPLATE,
          data,
        );
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
        return mapMessageByTemplate(
          PEDING_NOTIFICATION_REMOVE_MESSAGE_TEMPLATE,
          data,
        );
      case "success":
        return mapMessageByTemplate(
          SUCCESS_NOTIFICATION_REMOVE_MESSAGE_TEMPLATE,
          data,
        );
      case "error":
        return mapMessageByTemplate(
          ERROR_NOTIFICATION_REMOVE_MESSAGE_TEMPLATE,
          data,
        );
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
        return mapMessageByTemplate(
          PEDING_NOTIFICATION_ADD_INCENTIVIZE_MESSAGE_TEMPLATE,
          data,
        );
      case "success":
        return mapMessageByTemplate(
          SUCCESS_NOTIFICATION_ADD_INCENTIVIZE_MESSAGE_TEMPLATE,
          data,
        );
      case "error":
        return mapMessageByTemplate(
          ERROR_NOTIFICATION_ADD_INCENTIVIZE_MESSAGE_TEMPLATE,
          data,
        );
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
        return mapMessageByTemplate(
          PEDING_NOTIFICATION_WITHDRAW_MESSAGE_TEMPLATE,
          data,
        );
      case "success":
        return mapMessageByTemplate(
          SUCCESS_NOTIFICATION_WITHDRAW_MESSAGE_TEMPLATE,
          data,
        );
      case "error":
        return mapMessageByTemplate(
          ERROR_NOTIFICATION_WITHDRAW_MESSAGE_TEMPLATE,
          data,
        );
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
        return mapMessageByTemplate(
          PEDING_NOTIFICATION_ADD_LIQUIDITY_MESSAGE_TEMPLATE,
          data,
        );
      case "success":
        return mapMessageByTemplate(
          SUCCESS_NOTIFICATION_ADD_LIQUIDITY_MESSAGE_TEMPLATE,
          data,
        );
      case "error":
        return mapMessageByTemplate(
          ERROR_NOTIFICATION_ADD_LIQUIDITY_MESSAGE_TEMPLATE,
          data,
        );
    }
  }
  return {
    title: "Add Liquidity",
    description: description(),
    scannerUrl: hash ? makeScannerURL(hash) : "",
  };
}

export function makeBroadcastWrapTokenMessage(
  type: TNoticeType,
  data: {
    tokenASymbol: string;
    tokenBSymbol: string;
    tokenAAmount: string;
    tokenBAmount: string;
  },
  hash?: string,
): INoticeContent {
  function title() {
    switch (type) {
      case "pending":
        return "Wrap - Pending!";
      case "success":
        return "Wrap - Success!";
      case "error":
        return "Wrap - Failure!";
    }
  }
  function description() {
    switch (type) {
      case "pending":
        return mapMessageByTemplate(
          PEDING_NOTIFICATION_WRAP_TOKEN_MESSAGE_TEMPLATE,
          data,
        );
      case "success":
        return mapMessageByTemplate(
          SUCCESS_NOTIFICATION_WRAP_TOKEN_MESSAGE_TEMPLATE,
          data,
        );
      case "error":
        return mapMessageByTemplate(
          ERROR_NOTIFICATION_WRAP_TOKEN_MESSAGE_TEMPLATE,
          data,
        );
    }
  }
  return {
    title: title(),
    description: description(),
    scannerUrl: hash ? makeScannerURL(hash) : "",
  };
}

export function makeBroadcastUnwrapTokenMessage(
  type: TNoticeType,
  data: {
    tokenASymbol: string;
    tokenBSymbol: string;
    tokenAAmount: string;
    tokenBAmount: string;
  },
  hash?: string,
): INoticeContent {
  function title() {
    switch (type) {
      case "pending":
        return "Unwrap - Pending!";
      case "success":
        return "Unwrap - Success!";
      case "error":
        return "Unwrap - Failure!";
    }
  }
  function description() {
    switch (type) {
      case "pending":
        return mapMessageByTemplate(
          PEDING_NOTIFICATION_UNWRAP_TOKEN_MESSAGE_TEMPLATE,
          data,
        );
      case "success":
        return mapMessageByTemplate(
          SUCCESS_NOTIFICATION_UNWRAP_TOKEN_MESSAGE_TEMPLATE,
          data,
        );
      case "error":
        return mapMessageByTemplate(
          ERROR_NOTIFICATION_UNWRAP_TOKEN_MESSAGE_TEMPLATE,
          data,
        );
    }
  }
  return {
    title: title(),
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
    (
      content?: INoticeContent,
      callback?: () => void,
      isHiddenReject?: boolean,
    ) => {
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
