import BigNumber from "bignumber.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import ConfirmStopOrderModal from "@components/order/confirm-stop-order-modal/ConfirmStopOrderModal";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { DcaOrderModel } from "@models/order/dca-order-model";
import { LimitOrderModel } from "@models/order/limit-order-model";
import { StopOrderSummary } from "@models/order/order-summary";
import { TokenModel } from "@models/token/token-model";
import { useGetDcaOrder } from "@query/order";
import { DexEvent } from "@repositories/common";
import { checkGnotPath } from "@utils/common";
import { formatPrice } from "@utils/new-number-utils";
import { formatOrderFullAmount } from "@utils/order-format-utils";

import { useConfirmOrderModal } from "../ui/use-confirm-order-modal";
import { useOrderTransaction } from "./use-order-transaction";

const LIMIT_STATUS_LABEL_KEY: Partial<Record<LimitOrderModel["status"], string>> = {
  PARTIALLY_FILLED: "Swap:order.status.partiallyFilled",
  EXPIRED: "Swap:order.status.expired",
};

type SelectedOrder = { kind: "dca"; order: DcaOrderModel } | { kind: "limit"; order: LimitOrderModel };

/** Opens the Confirm Stop Order modal for a DCA order, or its cancel variant for a limit order, and sends it. */
export const useStopOrderHandler = () => {
  const { t } = useTranslation();
  const { orderRepository } = useGnoswapContext();
  const { tokenPrices } = useTokenData(true);
  const { submit } = useOrderTransaction();
  const [selected, setSelected] = useState<SelectedOrder | null>(null);

  // The modal reads the order again so the refund it shows is current.
  const { data: latestDcaOrder, isFetching: isFetchingDcaOrder } = useGetDcaOrder(
    selected?.kind === "dca" ? selected.order.orderId : null,
    selected?.kind === "dca" ? selected.order.packagePath : undefined,
  );

  const formatUsd = useCallback(
    (token: TokenModel, amount: BigNumber.Value | null) => {
      const price = tokenPrices[checkGnotPath(token.priceID)]?.usd ?? tokenPrices[checkGnotPath(token.path)]?.usd;
      if (price === undefined || price === null || amount === null) return "-";
      return formatPrice(BigNumber(amount).multipliedBy(price).toNumber());
    },
    [tokenPrices],
  );

  const summary: StopOrderSummary | null = useMemo(() => {
    if (!selected) return null;

    if (selected.kind === "dca") {
      const order =
        latestDcaOrder?.orderId === selected.order.orderId && latestDcaOrder.packagePath === selected.order.packagePath
          ? latestDcaOrder
          : selected.order;
      const { inputToken, outputToken } = order;
      return {
        kind: "dca",
        inputToken,
        outputToken,
        statusLabel: t("Swap:order.ongoing"),
        purchasedAmountUsd: formatUsd(outputToken, order.purchasedAmount),
        soldAmount: formatOrderFullAmount(order.soldAmount, inputToken.decimals),
        soldAmountUsd: formatUsd(inputToken, order.soldAmount),
        purchasedAmount: formatOrderFullAmount(order.purchasedAmount, outputToken.decimals),
        priceRate: order.priceRate === null ? "-" : formatOrderFullAmount(order.priceRate, outputToken.decimals),
        priceRateUsd: formatUsd(outputToken, order.priceRate),
        remainingAmount: formatOrderFullAmount(order.remainingAmount, inputToken.decimals),
        remainingAmountUsd: formatUsd(inputToken, order.remainingAmount),
      };
    }

    const order = selected.order;
    const { tokenIn, tokenOut } = order;
    const rate = order.priceRate ?? order.limitPrice;
    return {
      kind: "limit",
      inputToken: tokenIn,
      outputToken: tokenOut,
      statusLabel: t(LIMIT_STATUS_LABEL_KEY[order.status] ?? "Swap:order.ongoing"),
      purchasedAmountUsd: formatUsd(tokenOut, order.userOutput),
      soldAmount: formatOrderFullAmount(order.filledInput, tokenIn.decimals),
      soldAmountUsd: formatUsd(tokenIn, order.filledInput),
      purchasedAmount: formatOrderFullAmount(order.userOutput, tokenOut.decimals),
      priceRate: rate === null ? "-" : formatOrderFullAmount(rate, tokenOut.decimals),
      priceRateUsd: formatUsd(tokenOut, rate),
      remainingAmount: formatOrderFullAmount(order.remainingInput, tokenIn.decimals),
      remainingAmountUsd: formatUsd(tokenIn, order.remainingInput),
    };
  }, [formatUsd, latestDcaOrder, selected, t]);

  const sendStop = useCallback(() => {
    if (!selected || !summary) return;

    const messageData = {
      tokenASymbol: summary.inputToken.displaySymbol,
      tokenBSymbol: summary.outputToken.displaySymbol,
      tokenAAmount: summary.remainingAmount,
    };

    if (selected.kind === "dca") {
      const orderId = selected.order.orderId;
      submit({
        action: DexEvent.DCA_STOP,
        messageData,
        send: () => orderRepository.sendCancelDcaOrder({ orderId }),
      });
      return;
    }

    const orderId = selected.order.orderId;
    submit({
      action: DexEvent.LIMIT_CANCEL,
      messageData,
      send: () => orderRepository.sendCancelLimitOrder({ orderId }),
    });
  }, [orderRepository, selected, submit, summary]);

  const closeModalRef = useRef<() => void>(() => undefined);

  const renderModal = useCallback(
    () =>
      summary ? (
        <ConfirmStopOrderModal
          summary={summary}
          isLoading={isFetchingDcaOrder}
          confirm={() => {
            closeModalRef.current();
            sendStop();
          }}
          close={() => closeModalRef.current()}
        />
      ) : (
        <></>
      ),
    [isFetchingDcaOrder, sendStop, summary],
  );

  const { openModal, closeModal } = useConfirmOrderModal(renderModal);
  closeModalRef.current = () => {
    closeModal();
    setSelected(null);
  };

  // The modal opens once the selection has produced its summary.
  const pendingOpen = useRef(false);
  useEffect(() => {
    if (!pendingOpen.current || !summary) return;
    pendingOpen.current = false;
    openModal();
  }, [openModal, summary]);

  const openStopDcaOrder = useCallback(
    (order: DcaOrderModel) => {
      pendingOpen.current = true;
      setSelected({ kind: "dca", order });
    },
    [],
  );

  const openCancelLimitOrder = useCallback(
    (order: LimitOrderModel) => {
      if (!order.canCancel) return;
      pendingOpen.current = true;
      setSelected({ kind: "limit", order });
    },
    [],
  );

  /** Pays a completed DCA order's unclaimed output; the realm finalizes the order in the same call. */
  const claimDcaOrder = useCallback(
    (order: DcaOrderModel) => {
      if (!order.canClaim) return;

      const orderId = order.orderId;
      submit({
        action: DexEvent.DCA_CLAIM,
        messageData: {
          tokenASymbol: order.outputToken.displaySymbol,
          tokenBSymbol: order.inputToken.displaySymbol,
          tokenAAmount: formatOrderFullAmount(order.claimableAmount, order.outputToken.decimals),
        },
        send: () => orderRepository.sendClaimDcaOrder({ orderId }),
      });
    },
    [orderRepository, submit],
  );

  return { openStopDcaOrder, openCancelLimitOrder, claimDcaOrder };
};
