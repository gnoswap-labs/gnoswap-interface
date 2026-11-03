import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import IconLinkOff from "@components/common/icons/IconLinkOff";
import Pagination from "@components/common/pagination/Pagination";
import SelectTab from "@components/common/select-tab/SelectTab";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { OrderListTab } from "@models/order/order-type";

import { OrderListWrapper } from "./OrderList.styles";

const SKELETON_COUNT = 2;

export interface OrderListProps {
  tab: OrderListTab;
  changeTab: (tab: OrderListTab) => void;
  connectedWallet: boolean;
  isLoading: boolean;
  isEmpty: boolean;
  currentPage: number;
  totalPages: number;
  changePage: (page: number) => void;
  compact?: boolean;
  children?: React.ReactNode;
}

/** Active / Past order lists under the order card. Keeps the tabs even without a wallet. */
const OrderList: React.FC<OrderListProps> = ({
  tab,
  changeTab,
  connectedWallet,
  isLoading,
  isEmpty,
  currentPage,
  totalPages,
  changePage,
  compact = false,
  children,
}) => {
  const { t } = useTranslation();

  const tabs = useMemo(
    () => [
      { key: "active", display: t("Swap:order.active") },
      { key: "past", display: t("Swap:order.past") },
    ],
    [t],
  );

  const content = (() => {
    if (!connectedWallet) {
      return (
        <div className="order-empty">
          <IconLinkOff className="empty-icon" />
          <span>{t("Swap:order.connectWallet")}</span>
        </div>
      );
    }
    if (isLoading) {
      return Array.from({ length: SKELETON_COUNT }).map((_, index) => (
        <span key={index} className="order-skeleton" css={pulseSkeletonStyle({ w: "100%", h: 150 })} />
      ));
    }
    if (isEmpty) {
      return <div className="order-empty">{t("Swap:order.noOrders")}</div>;
    }
    return children;
  })();

  return (
    <OrderListWrapper>
      <SelectTab selectType={tab} list={tabs} onClick={key => changeTab(key as OrderListTab)} />
      <span className="order-list-title">{t("Swap:order.order")}</span>
      <div className="order-items">{content}</div>
      {connectedWallet && totalPages > 1 && (
        <div className="pagination">
          <Pagination
            currentPage={currentPage}
            totalPage={totalPages}
            onPageChange={changePage}
            siblingCount={compact ? 0 : 1}
            compact={compact}
          />
        </div>
      )}
    </OrderListWrapper>
  );
};

export default OrderList;
