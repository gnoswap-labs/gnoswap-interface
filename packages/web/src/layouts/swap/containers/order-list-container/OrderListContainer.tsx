import { useAtom } from "jotai";
import React, { useCallback, useState } from "react";

import { ENABLED_SWAP_CARD_TYPES } from "@constants/order.constant";
import { SWAP_HISTORY_REFETCH_INTERVAL } from "@constants/swap.constant";
import useRouter from "@hooks/common/use-custom-router";
import { useGnoscanUrl } from "@hooks/common/use-gnoscan-url";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useStopOrderHandler } from "@hooks/order/data/use-stop-order-handler";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { OrderKind, OrderListTab, SWAP_CARD_TYPE, SwapCardType, toEnabledSwapCardType } from "@models/order/order-type";
import { useGetDcaOrders, useGetLimitOrders } from "@query/order";
import { OrderState } from "@states/index";
import { formatOrderRoi } from "@utils/order-format-utils";

import DcaOrderItemCard from "../../components/order-list/order-card/DcaOrderItemCard";
import LimitOrderItemCard from "../../components/order-list/order-card/LimitOrderItemCard";
import OrderList from "../../components/order-list/OrderList";
import { DcaOrderHistoryContainer, LimitOrderHistoryContainer } from "./OrderHistoryContainer";

const ORDER_PAGE_SIZE = 10;

/**
 * Whether the account has any order of the kind, from the totals of its Active
 * and Past lists. Unknown until both totals load, so an account without orders
 * never flashes an empty list.
 */
export const hasAnyOrder = (activeTotal?: number, pastTotal?: number): boolean | undefined => {
  if (activeTotal === undefined || pastTotal === undefined) return undefined;

  return activeTotal + pastTotal > 0;
};

interface OrderListContainerProps {
  kind: OrderKind;
}

/** The connected account's DCA or limit orders, newest first, regardless of the selected tokens. */
const OrderListContainer: React.FC<OrderListContainerProps> = ({ kind }) => {
  const { connected, account } = useWallet();
  const [tab, setTab] = useAtom(OrderState.orderListTab);

  const address = connected ? account?.address ?? "" : "";

  // The list only appears once the account has an order of this kind, active or past.
  // One-item pages of both tabs give their totals whichever tab is open.
  const totalRequest = (status: OrderListTab) => ({ address, status, page: 1, size: 1 });
  const totalOptions = (orderKind: OrderKind, cardType: SwapCardType) => ({
    enabled: !!address && kind === orderKind && ENABLED_SWAP_CARD_TYPES.includes(cardType),
    keepPreviousData: false,
  });
  const activeDcaTotal = useGetDcaOrders(totalRequest("active"), totalOptions("dca", SWAP_CARD_TYPE.DCA));
  const pastDcaTotal = useGetDcaOrders(totalRequest("past"), totalOptions("dca", SWAP_CARD_TYPE.DCA));
  const activeLimitTotal = useGetLimitOrders(totalRequest("active"), totalOptions("limit", SWAP_CARD_TYPE.LIMIT));
  const pastLimitTotal = useGetLimitOrders(totalRequest("past"), totalOptions("limit", SWAP_CARD_TYPE.LIMIT));
  const [activeTotal, pastTotal] = kind === "dca" ? [activeDcaTotal, pastDcaTotal] : [activeLimitTotal, pastLimitTotal];
  const hasOrders = hasAnyOrder(activeTotal.data?.pageInfo.totalItems, pastTotal.data?.pageInfo.totalItems);

  const changeTab = useCallback((next: OrderListTab) => setTab(next), [setTab]);

  // Without a wallet the tabs stay as a prompt; with one, an account without orders shows no list.
  if (connected && hasOrders !== true) return null;

  // Remounted per kind, tab and account: the page starts at 1, and a page of the other tab is never
  // kept on screen as the previous data while this tab's first page loads.
  return (
    <OrderListPages
      key={`${kind}-${tab}-${address}`}
      kind={kind}
      tab={tab}
      changeTab={changeTab}
      connected={connected}
      address={address}
    />
  );
};

interface OrderListPagesProps {
  kind: OrderKind;
  tab: OrderListTab;
  changeTab: (tab: OrderListTab) => void;
  connected: boolean;
  address: string;
}

/** One tab's orders, a page at a time. */
const OrderListPages: React.FC<OrderListPagesProps> = ({ kind, tab, changeTab, connected, address }) => {
  const { isMobile } = useWindowSize();
  const { getTxUrl } = useGnoscanUrl();
  const { openStopDcaOrder, openCancelLimitOrder, claimDcaOrder } = useStopOrderHandler();
  const [page, setPage] = useState(1);

  const request = { address, status: tab, page, size: ORDER_PAGE_SIZE };

  // Both lists stay loaded so switching between DCA and Limit shows the cached list at once;
  // only the visible one keeps polling, as often as the swap history while on Active. Each tab
  // switch remounts this list, and it refetches then even when cached (the app default skips
  // refetch on mount).
  const pollInterval = (orderKind: OrderKind) => {
    if (kind !== orderKind) return { refetchInterval: false as const };
    return tab === "active" ? { refetchInterval: SWAP_HISTORY_REFETCH_INTERVAL } : {};
  };
  const dcaOrders = useGetDcaOrders(request, {
    enabled: !!address && ENABLED_SWAP_CARD_TYPES.includes(SWAP_CARD_TYPE.DCA),
    refetchOnMount: "always",
    ...pollInterval("dca"),
  });
  const limitOrders = useGetLimitOrders(request, {
    enabled: !!address && ENABLED_SWAP_CARD_TYPES.includes(SWAP_CARD_TYPE.LIMIT),
    refetchOnMount: "always",
    ...pollInterval("limit"),
  });
  const { data, isLoading } = kind === "dca" ? dcaOrders : limitOrders;

  const items = (() => {
    if (kind === "dca") {
      return (dcaOrders.data?.items ?? []).map(order => (
        <DcaOrderItemCard
          key={order.orderId}
          order={order}
          roi={formatOrderRoi(order.returnRate)}
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
