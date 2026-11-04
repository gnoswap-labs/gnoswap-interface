import { useAtom } from "jotai";
import React, { useCallback, useEffect, useState } from "react";

import { ENABLED_SWAP_CARD_TYPES } from "@constants/order.constant";
import useRouter from "@hooks/common/use-custom-router";
import { useGnoscanUrl } from "@hooks/common/use-gnoscan-url";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useStopOrderHandler } from "@hooks/order/data/use-stop-order-handler";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { calculateOrderRoi } from "@models/order/mapper/order-mapper";
import { OrderKind, OrderListTab, SWAP_CARD_TYPE, toEnabledSwapCardType } from "@models/order/order-type";
import { TokenModel } from "@models/token/token-model";
import { useGetDcaOrders, useGetLimitOrders } from "@query/order";
import { OrderState } from "@states/index";
import { checkGnotPath } from "@utils/common";
import { formatOrderRoi } from "@utils/order-format-utils";

import DcaOrderItemCard from "../../components/order-list/order-card/DcaOrderItemCard";
import LimitOrderItemCard from "../../components/order-list/order-card/LimitOrderItemCard";
import OrderList from "../../components/order-list/OrderList";
import { DcaOrderHistoryContainer, LimitOrderHistoryContainer } from "./OrderHistoryContainer";

const ORDER_PAGE_SIZE = 10;

interface OrderListContainerProps {
  kind: OrderKind;
}

/** The connected account's DCA or limit orders, newest first, regardless of the selected tokens. */
const OrderListContainer: React.FC<OrderListContainerProps> = ({ kind }) => {
  const { connected, account } = useWallet();
  const { isMobile } = useWindowSize();
  const { getTxUrl } = useGnoscanUrl();
  const { tokenPrices } = useTokenData(true);
  const { openStopDcaOrder, openCancelLimitOrder, claimDcaOrder } = useStopOrderHandler();
  const [tab, setTab] = useAtom(OrderState.orderListTab);
  const [page, setPage] = useState(1);

  const address = connected ? (account?.address ?? "") : "";
  const request = { address, status: tab, page, size: ORDER_PAGE_SIZE };

  // Both lists stay loaded so switching between DCA and Limit shows the cached list at once;
  // only the visible one keeps polling.
  const dcaOrders = useGetDcaOrders(request, {
    enabled: !!address && ENABLED_SWAP_CARD_TYPES.includes(SWAP_CARD_TYPE.DCA),
    ...(kind !== "dca" && { refetchInterval: false }),
  });
  const limitOrders = useGetLimitOrders(request, {
    enabled: !!address && ENABLED_SWAP_CARD_TYPES.includes(SWAP_CARD_TYPE.LIMIT),
    ...(kind !== "limit" && { refetchInterval: false }),
  });
  const { data, isLoading } = kind === "dca" ? dcaOrders : limitOrders;

  useEffect(() => setPage(1), [kind, tab, address]);

  const changeTab = useCallback((next: OrderListTab) => setTab(next), [setTab]);

  const getUsdPrice = useCallback(
    (token: TokenModel) =>
      tokenPrices[checkGnotPath(token.priceID)]?.usd ?? tokenPrices[checkGnotPath(token.path)]?.usd ?? null,
    [tokenPrices],
  );

  const items = (() => {
    if (kind === "dca") {
      return (dcaOrders.data?.items ?? []).map(order => (
        <DcaOrderItemCard
          key={order.orderId}
          order={order}
          roi={formatOrderRoi(
            calculateOrderRoi(
              order.soldAmount,
              order.purchasedAmount,
              getUsdPrice(order.inputToken),
              getUsdPrice(order.outputToken),
            ),
          )}
          txUrl={getTxUrl(order.createdTxHash)}
          onClickStop={openStopDcaOrder}
          onClickClaim={claimDcaOrder}
          renderHistory={item => <DcaOrderHistoryContainer order={item} />}
        />
      ));
    }

    return (limitOrders.data?.items ?? []).map(order => (
      <LimitOrderItemCard
        key={order.orderId}
        order={order}
        txUrl={getTxUrl(order.createdTxHash)}
        onClickCancel={openCancelLimitOrder}
        renderHistory={item => <LimitOrderHistoryContainer order={item} />}
      />
    ));
  })();

  return (
    <OrderList
      tab={tab}
      changeTab={changeTab}
      connectedWallet={connected}
      isLoading={!!address && isLoading}
      isEmpty={items.length === 0}
      currentPage={page}
      totalPages={data?.pageInfo.totalPages ?? 0}
      changePage={setPage}
      compact={isMobile}
    >
      {items}
    </OrderList>
  );
};

/** Shows the order list under the DCA and Limit cards; the Swap card has none. */
const SwapOrderListContainer: React.FC = () => {
  const router = useRouter();
  // A disabled mode falls back to Swap, which has no order list.
  const swapType = toEnabledSwapCardType(router.query.type, ENABLED_SWAP_CARD_TYPES);

  if (swapType === SWAP_CARD_TYPE.SWAP) return null;
  return <OrderListContainer kind={swapType} />;
};

export { OrderListContainer };
export default SwapOrderListContainer;
