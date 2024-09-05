
import { useState } from "react";

import { ERROR_VALUE } from "@common/errors/adena";
import { useBroadcastHandler } from "@hooks/common/use-broadcast-handler";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useMessage } from "@hooks/common/use-message";
import { usePreventScroll } from "@hooks/common/use-prevent-scroll";
import { useTransactionConfirmModal } from "@hooks/common/use-transaction-confirm-modal";
import { useTransactionEventStore } from "@hooks/common/use-transaction-event-store";
import { useWallet } from "@hooks/wallet/use-wallet";
import { DexEvent } from "@repositories/common";
import { GNS_TOKEN } from "@common/values/token-constant";

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

    broadcastLoading(getMessage(DexEvent.DELEGATE, "pending", messageData));
    openTransactionConfirmModal();

    governanceRepository
      .sendDelegate({ to: toAddress, amount: unitAmount.toString() })
      .then(response => {
        if (
          response?.code === 0 ||
          response?.code === ERROR_VALUE.TRANSACTION_FAILED.status
        ) {
          enqueueEvent({
            txHash: response?.data?.hash,
            action: DexEvent.DELEGATE,
            formatData: response => {
              if (!response) {
                return messageData;
              }

              return {
                ...messageData,
                // tokenAAmount: response[0],
              };
            },
            onUpdate: async () => {
              // await updateBalances();
            },
          });
        }

        if (response?.code === 0) {
          openTransactionConfirmModal();
          broadcastSuccess(
            getMessage(
              DexEvent.DELEGATE,
              "success",
              messageData,
              response.data?.hash,
            ),
          );
        } else if (
          response?.code === ERROR_VALUE.TRANSACTION_REJECTED.status // 4000
        ) {
          broadcastRejected(
            getMessage(DexEvent.DELEGATE, "error", messageData),
          );
          openTransactionConfirmModal();
        } else {
          broadcastError(
            getMessage(
              DexEvent.DELEGATE,
              "error",
              messageData,
              response?.data?.hash,
            ),
          );
          openTransactionConfirmModal();
        }
      })
      .catch(e => {
        console.warn(`Something wrong in delegateGNS ${e}`);
      });
  };

  return {
    delegateGNS,
  };
};
