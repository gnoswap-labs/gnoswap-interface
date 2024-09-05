
import { useState } from "react";

import { ERROR_VALUE } from "@common/errors/adena";
import { useBroadcastHandler } from "@hooks/common/use-broadcast-handler";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useMessage } from "@hooks/common/use-message";
import { usePreventScroll } from "@hooks/common/use-prevent-scroll";
import { useTransactionConfirmModal } from "@hooks/common/use-transaction-confirm-modal";
import { useTransactionEventStore } from "@hooks/common/use-transaction-event-store";
import { useWallet } from "@hooks/wallet/use-wallet";
import { DexEvent, DexEventType } from "@repositories/common";
import { GNS_TOKEN } from "@common/values/token-constant";
import { WalletResponse } from "@common/clients/wallet-client/protocols";

export const useGovernanceTx = () => {
  const { account } = useWallet();
  const { governanceRepository } = useGnoswapContext();
  const { getMessage } = useMessage();

  const [openedConfirmModal] = useState(false);
  const { enqueueEvent } = useTransactionEventStore();
  const { openModal: openTransactionConfirmModal } =
    useTransactionConfirmModal();
  const {
    broadcastSuccess,
    broadcastLoading,
    broadcastError,
    broadcastRejected,
  } = useBroadcastHandler();

  usePreventScroll(openedConfirmModal);

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
    },
    formatData: (result: string[] | null) => {
      tokenASymbol?: string;
      tokenBSymbol?: string;
      tokenAAmount?: string;
      tokenBAmount?: string;
      target?: string;
    },
    updateCallback?: () => Promise<void>,
  ) => {

    broadcastLoading(getMessage(eventType, "pending", messageData));
    openTransactionConfirmModal();

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
            onUpdate: async () => {
              if (updateCallback) await updateCallback();
            },
          });
        }

        if (response?.code === 0) {
          openTransactionConfirmModal();
          broadcastSuccess(
            getMessage(eventType, "success", messageData, response.data?.hash),
          );
        } else if (
          response?.code === ERROR_VALUE.TRANSACTION_REJECTED.status // 4000
        ) {
          broadcastRejected(getMessage(eventType, "error", messageData));
          openTransactionConfirmModal();
        } else {
          broadcastError(
            getMessage(eventType, "error", messageData, response?.data?.hash),
          );
          openTransactionConfirmModal();
        }
      })
      .catch(e => {
        console.warn(`Something wrong in ${eventType}: ${e}`);
      });

  };

  const delegateGNS = (toName: string, toAddress: string, amount: string) => {
    if (!account) {
      return;
    }

    const unitAmount = Math.floor(Number(amount) * 10 ** GNS_TOKEN.decimals);

    const messageData = {
      tokenAAmount: (unitAmount / 10 ** GNS_TOKEN.decimals).toLocaleString(
        "en",
      ),
      tokenASymbol: GNS_TOKEN.symbol,
      target: toName,
    };

    processTx(
      () =>
        governanceRepository.sendDelegate({
          to: toAddress,
          amount: unitAmount.toString(),
        }),
      DexEvent.DELEGATE,
      messageData,
      response => {
        if (!response) {
          return messageData;
        }
        // TODO : use tx data
        return {
          ...messageData,
          // tokenAAmount: response[0],
        };
      },
    );
  };

const undelegateGNS = (fromName: string, fromAddress: string, amount: string) => {
  if (!account) {
    return;
  }

  const unitAmount = Math.floor(Number(amount) * 10 ** GNS_TOKEN.decimals);

  const messageData = {
    tokenAAmount: (unitAmount / 10 ** GNS_TOKEN.decimals).toLocaleString("en"),
    tokenASymbol: GNS_TOKEN.symbol,
    target: fromName,
  };

  processTx(
    () =>
      governanceRepository.sendUndelegate({
        to: fromAddress,
        amount: unitAmount.toString(),
      }),
    DexEvent.UNDELEGATE,
    messageData,
    response => {
      if (!response) {
        return messageData;
      }
      // TODO : use tx data
      return {
        ...messageData,
        // tokenAAmount: response[0],
      };
    },
  );

};

  return {
    delegateGNS,
    undelegateGNS,
  };
};
