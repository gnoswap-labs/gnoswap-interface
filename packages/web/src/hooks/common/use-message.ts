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
      target?: string;
      memo0?: string;
    },
  ) {
    const message = (() => {
      switch (action) {
        // Swap
        case DexEvent.SWAP:
          return {
            pending: t("Modal:confirm.swap.status.pending", data),
            success: t("Modal:confirm.swap.status.success", data),
            error: t("Modal:confirm.swap.status.error", data),
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
        // Position
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
        case DexEvent.COLLECT_GOV_REWARD: // governance reward
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
        // Wallet
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
        // Governance
        case DexEvent.DELEGATE:
          return {
            pending: t("Modal:confirm.delegate.status.pending", data),
            success: t("Modal:confirm.delegate.status.success", data),
            error: t("Modal:confirm.delegate.status.error", data),
          };
        case DexEvent.UNDELEGATE:
          return {
            pending: t("Modal:confirm.undel.status.pending", data),
            success: t("Modal:confirm.undel.status.success", data),
            error: t("Modal:confirm.undel.status.error", data),
          };
        case DexEvent.COLLECT_UNDEL:
          return {
            pending: t("Modal:confirm.collectUndel.status.pending", data),
            success: t("Modal:confirm.collectUndel.status.success", data),
            error: t("Modal:confirm.collectUndel.status.error", data),
          };
        case DexEvent.PROPOSE_TEXT:
        case DexEvent.PROPOSE_COMM_POOL_SPEND:
        case DexEvent.PROPOSE_PARAM_CHANGE:
          return {
            pending: t("Modal:confirm.propose.status.pending", data),
            success: t("Modal:confirm.propose.status.success", data),
            error: t("Modal:confirm.propose.status.error", data),
          };
        case DexEvent.VOTE:
          return {
            pending: t("Modal:confirm.vote.status.pending", data),
            success: t("Modal:confirm.vote.status.success", data),
            error: t("Modal:confirm.vote.status.error", data),
          };
        case DexEvent.EXECUTE_PROPOSAL:
          return {
            pending: t("Modal:confirm.executeProposal.status.pending", data),
            success: t("Modal:confirm.executeProposal.status.success", data),
            error: t("Modal:confirm.executeProposal.status.error", data),
          };
        case DexEvent.CANCEL_PROPOSAL:
          return {
            pending: t("Modal:confirm.cancelProposal.status.pending", data),
            success: t("Modal:confirm.cancelProposal.status.success", data),
            error: t("Modal:confirm.cancelProposal.status.error", data),
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
        // Swap
        case DexEvent.SWAP:
          return t("Modal:confirm.swap.title");
        case DexEvent.WRAP:
          return t("Modal:confirm.wrap.title");
        case DexEvent.UNWRAP:
          return t("Modal:confirm.unwrap.title");
        // Position
        case DexEvent.ADD:
          return t("Modal:confirm.add.title");
        case DexEvent.REMOVE:
          return t("Modal:confirm.remove.title");
        case DexEvent.CLAIM_FEE:
        case DexEvent.COLLECT_GOV_REWARD: // governance reward
          return t("Modal:confirm.claim.title");
        case DexEvent.ADD_INCENTIVE:
          return t("Modal:confirm.addIncentive.title");
        case DexEvent.STAKE:
          return t("Modal:confirm.stake.title");
        case DexEvent.UNSTAKE:
          return t("Modal:confirm.unstake.title");
        // Wallet
        case DexEvent.ASSET_SEND:
          return t("Modal:confirm.assetSend.title");
        // Governance
        case DexEvent.DELEGATE:
          return t("Modal:confirm.delegate.title");
        case DexEvent.UNDELEGATE:
          return t("Modal:confirm.undel.title");
        case DexEvent.COLLECT_UNDEL:
          return t("Modal:confirm.collectUndel.title");
        case DexEvent.PROPOSE_TEXT:
        case DexEvent.PROPOSE_COMM_POOL_SPEND:
        case DexEvent.PROPOSE_PARAM_CHANGE:
          return t("Modal:confirm.propose.title");
        case DexEvent.VOTE:
          return t("Modal:confirm.vote.title");
        case DexEvent.EXECUTE_PROPOSAL:
          return t("Modal:confirm.executeProposal.title");
        case DexEvent.CANCEL_PROPOSAL:
          return t("Modal:confirm.cancelProposal.title");
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
