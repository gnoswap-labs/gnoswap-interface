import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { DexEvent, DexEventType } from "@repositories/common";

import { SnackbarContent, SnackbarType } from "./use-snackbar";

export const useMessage = () => {
  const { t } = useTranslation();

  function getDescription(
    action: DexEventType,
    type: SnackbarType,
    data: {
      tokenASymbol?: string;
      tokenBSymbol?: string;
      tokenAAmount?: string;
      tokenBAmount?: string;
    },
  ) {
    const message = (() => {
      switch (action) {
        case DexEvent.SWAP:
          return {
            pending: t("Modal:confirm.swap.status.pending", data),
            success: t("Modal:confirm.swap.status.success", data),
            error: t("Modal:confirm.swap.status.error", data),
          };
        case DexEvent.ADD:
          return {
            pending: t("Modal:confirm.add.status.pending", data),
            success: t("Modal:confirm.add.status.success", data),
            error: t("Modal:confirm.add.status.error", data),
          };
        case DexEvent.REMOVE:
          return {
            pending: t("Modal:confirm.remove.status.pending", data),
            success: t("Modal:confirm.remove.status.success", data),
            error: t("Modal:confirm.remove.status.error", data),
          };
        case DexEvent.CLAIM_FEE:
          return {
            pending: t("Modal:confirm.claim.status.pending", data),
            success: t("Modal:confirm.claim.status.success", data),
            error: t("Modal:confirm.claim.status.error", data),
          };
        case DexEvent.ADD_INCENTIVE:
          return {
            pending: t("Modal:confirm.addIncentive.status.pending", data),
            success: t("Modal:confirm.addIncentive.status.success", data),
            error: t("Modal:confirm.addIncentive.status.error", data),
          };
        case DexEvent.STAKE:
          return {
            pending: t("Modal:confirm.stake.status.pending", data),
            success: t("Modal:confirm.stake.status.success", data),
            error: t("Modal:confirm.stake.status.error", data),
          };
        case DexEvent.UNSTAKE:
          return {
            pending: t("Modal:confirm.unstake.status.pending", data),
            success: t("Modal:confirm.unstake.status.success", data),
            error: t("Modal:confirm.unstake.status.error", data),
          };
        case DexEvent.ASSET_SEND:
          return {
            pending: t("Modal:confirm.assetSend.status.pending", data),
            success: t("Modal:confirm.assetSend.status.success", data),
            error: t("Modal:confirm.assetSend.status.error", data),
          };
        case DexEvent.WRAP:
          return {
            pending: t("Modal:confirm.wrap.status.pending", data),
            success: t("Modal:confirm.wrap.status.success", data),
            error: t("Modal:confirm.wrap.status.error", data),
          };
        case DexEvent.UNWRAP:
          return {
            pending: t("Modal:confirm.unwrap.status.pending", data),
            success: t("Modal:confirm.unwrap.status.success", data),
            error: t("Modal:confirm.unwrap.status.error", data),
          };
        default:
          return {
            pending: "Undefined task",
            success: "Undefined task",
            error: "Undefined task",
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
    (action: DexEventType) => {
      switch (action) {
        case DexEvent.SWAP:
          return t("Modal:confirm.swap.title");
        case DexEvent.ADD:
          return t("Modal:confirm.add.title");
        case DexEvent.REMOVE:
          return t("Modal:confirm.remove.title");
        case DexEvent.CLAIM_FEE:
          return t("Modal:confirm.claim.title");
        case DexEvent.ADD_INCENTIVE:
          return t("Modal:confirm.addIncentive.title");
        case DexEvent.STAKE:
          return t("Modal:confirm.stake.title");
        case DexEvent.UNSTAKE:
          return t("Modal:confirm.unstake.title");
        case DexEvent.ASSET_SEND:
          return t("Modal:confirm.assetSend.title");
        case DexEvent.WRAP:
          return t("Modal:confirm.wrap.title");
        case DexEvent.UNWRAP:
          return t("Modal:confirm.unwrap.title");
        default:
          return "Undefined task";
      }
    },
    [t],
  );

  function getMessage(
    action: DexEventType,
    type: SnackbarType,
    data: {
      tokenASymbol?: string;
      tokenBSymbol?: string;
      tokenAAmount?: string;
      tokenBAmount?: string;
    },
    txHash?: string,
  ): SnackbarContent {
    return {
      title: title(action),
      description: getDescription(action, type, data),
      txHash: txHash || "",
    };
  }

  return { getMessage };
};
