import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { INoticeContent } from "@components/common/notice/NoticeToast";
import { TNoticeType } from "@context/NoticeContext";

type ACTION_TYPE =
  | "SWAP"
  | "ADD"
  | "CLAIM"
  | "REMOVE"
  | "WITHDRAW"
  | "WRAP"
  | "UNWRAP"
  | "ADD_INCENTIVIZE"
  | "STAKE"
  | "UNSTAKE"
  | "WITHDRAW";

export const useMessage = () => {
  const { t } = useTranslation();

  function getDescription(
    action: ACTION_TYPE,
    type: TNoticeType,
    data: {
      tokenASymbol?: string;
      tokenBSymbol?: string;
      tokenAAmount?: string;
      tokenBAmount?: string;
    },
  ) {
    const message = (() => {
      switch (action) {
        case "SWAP":
          return {
            pending: t("Modal:confirm.swap.status.pending", data),
            success: t("Modal:confirm.swap.status.success", data),
            error: t("Modal:confirm.swap.status.error", data),
          };
        case "ADD":
          return {
            pending: t("Modal:confirm.add.status.pending", data),
            success: t("Modal:confirm.add.status.success", data),
            error: t("Modal:confirm.add.status.error", data),
          };
        case "CLAIM":
          return {
            pending: t("Modal:confirm.claim.status.pending", data),
            success: t("Modal:confirm.claim.status.success", data),
            error: t("Modal:confirm.claim.status.error", data),
          };
        case "REMOVE":
          return {
            pending: t("Modal:confirm.remove.status.pending", data),
            success: t("Modal:confirm.remove.status.success", data),
            error: t("Modal:confirm.remove.status.error", data),
          };
        case "WITHDRAW":
          return {
            pending: t("Modal:confirm.withdraw.status.pending", data),
            success: t("Modal:confirm.withdraw.status.success", data),
            error: t("Modal:confirm.withdraw.status.error", data),
          };
        case "WRAP":
          return {
            pending: t("Modal:confirm.wrap.status.pending", data),
            success: t("Modal:confirm.wrap.status.success", data),
            error: t("Modal:confirm.wrap.status.error", data),
          };
        case "UNWRAP":
          return {
            pending: t("Modal:confirm.unwrap.status.pending", data),
            success: t("Modal:confirm.unwrap.status.success", data),
            error: t("Modal:confirm.unwrap.status.error", data),
          };
        case "ADD_INCENTIVIZE":
          return {
            pending: t("Modal:confirm.addIncentive.status.pending", data),
            success: t("Modal:confirm.addIncentive.status.success", data),
            error: t("Modal:confirm.addIncentive.status.error", data),
          };
        case "STAKE":
          return {
            pending: t("Modal:confirm.stake.status.pending", data),
            success: t("Modal:confirm.stake.status.success", data),
            error: t("Modal:confirm.stake.status.error", data),
          };
        case "UNSTAKE":
          return {
            pending: t("Modal:confirm.unstake.status.pending", data),
            success: t("Modal:confirm.unstake.status.success", data),
            error: t("Modal:confirm.unstake.status.error", data),
          };
      }
    })();

    switch (type) {
      case "pending":
        return message?.pending;
      case "success":
        return message?.success;
      case "error":
        return message?.error;
    }
  }

  const title = useCallback(
    (action: ACTION_TYPE) => {
      switch (action) {
        case "SWAP":
          return t("Modal:confirm.swap.title");
        case "ADD":
          return t("Modal:confirm.add.title");
        case "CLAIM":
          return t("Modal:confirm.claim.title");
        case "REMOVE":
          return t("Modal:confirm.remove.title");
        case "WITHDRAW":
          return t("Modal:confirm.withdraw.title");
        case "WRAP":
          return t("Modal:confirm.wrap.title");
        case "UNWRAP":
          return t("Modal:confirm.unwrap.title");
        case "ADD_INCENTIVIZE":
          return t("Modal:confirm.addIncentive.title");
        case "STAKE":
          return t("Modal:confirm.stake.title");
        case "UNSTAKE":
          return t("Modal:confirm.unstake.title");
      }
    },
    [t],
  );

  function getMessage(
    action: ACTION_TYPE,
    type: TNoticeType,
    data: {
      tokenASymbol?: string;
      tokenBSymbol?: string;
      tokenAAmount?: string;
      tokenBAmount?: string;
    },
    txHash?: string,
  ): INoticeContent {
    return {
      title: title(action),
      description: getDescription(action, type, data),
      txHash: txHash || "",
    };
  }

  return { getMessage };
};
