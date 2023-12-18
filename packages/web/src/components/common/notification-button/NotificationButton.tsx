import React, { useMemo } from "react";
import { TransactionModel } from "@models/account/account-history-model";
import IconAlert from "@components/common/icons/IconAlert";
import NotificationList from "@components/common/notification-list/NotificationList";
import { AlertButton, NotificationWrapper } from "./NotificationButton.styles";
import { useAtom } from "jotai";
import { CommonState } from "@states/index";
import { DEVICE_TYPE } from "@styles/media";
import useEscCloseModal from "@hooks/common/use-esc-close-modal";
import { OnchainActivityResponse } from "@repositories/dashboard/response/onchain-response";
import dayjs from "dayjs";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@hooks/wallet/use-wallet";
import { prettyNumber } from "@utils/number-utils";

export interface TransactionGroupsType {
  title: string;
  txs: Array<TransactionModel>;
}

const capitalizeFirstLetter = (input: string) => {
  const str = input.toLowerCase();
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const replaceToken = (symbol: string) => {
  if (symbol === "WGNOT") return "GNOT";
  return symbol;
};

// Function to group the transactions by date
function groupTransactionsByDate(
  transactions: OnchainActivityResponse,
): TransactionGroupsType[] {
  const today = dayjs();
  const todayTransactions: TransactionModel[] = [];
  const pastWeekTransactions: TransactionModel[] = [];
  const pastMonthTransactions: TransactionModel[] = [];
  const olderTransactions: TransactionModel[] = [];

  for (const tx of transactions) {
    const transactionDate = dayjs(tx.time);
    const txModel: TransactionModel = {
      txType: 0,
      txHash: tx.txHash,
      tokenInfo: tx.token1?.name
        ? { tokenA: tx.token0, tokenB: tx.token1 }
        : tx.token0,
      status: "SUCCESS",
      createdAt: tx.time,
      content: `${capitalizeFirstLetter(tx.actionType)} ${prettyNumber(
        tx.token0Amount,
      )} ${replaceToken(tx.token0.symbol ?? tx.token1.symbol)}`,
      isRead: true,
    };

    if (transactionDate.isSame(today, "day")) {
      todayTransactions.push(txModel);
    } else if (transactionDate.isAfter(today.subtract(7, "day"))) {
      pastWeekTransactions.push(txModel);
    } else if (transactionDate.isAfter(today.subtract(30, "day"))) {
      pastMonthTransactions.push(txModel);
    } else {
      olderTransactions.push();
    }
  }

  return [
    {
      title: "Today",
      txs: todayTransactions,
    },
    {
      title: "Past 7 Days",
      txs: pastWeekTransactions,
    },
    {
      title: "Past 30 Days",
      txs: pastMonthTransactions,
    },
    {
      title: "More than a month ago",
      txs: olderTransactions,
    },
  ];
}

const NotificationButton = ({ breakpoint }: { breakpoint: DEVICE_TYPE }) => {
  const [toggle, setToggle] = useAtom(CommonState.headerToggle);
  const { dashboardRepository } = useGnoswapContext();
  const { account } = useWallet();
  const handleESC = () => {
    setToggle(prev => {
      if (prev.notification) {
        return {
          ...prev,
          notification: false,
        };
      }
      return prev;
    });
  };

  const { data: txs } = useQuery<OnchainActivityResponse, Error>({
    queryKey: ["accountOnChainActivity"],
    queryFn: () =>
      dashboardRepository.getAccountOnchainActivity({
        address: account?.address,
      }),
  });

  useEscCloseModal(() => handleESC());

  const onListToggle = () => {
    setToggle(prev => ({
      ...prev,
      notification: !prev.notification,
    }));
  };

  // TODO : Moving data logic to HeaderContainer
  const txsGroupsInformation: TransactionGroupsType[] = [];
  const txsList = useMemo(() => groupTransactionsByDate(txs ?? []), [txs]);
  if (txsList.length) txsGroupsInformation.push(...txsList);

  return (
    <NotificationWrapper>
      <AlertButton onClick={onListToggle}>
        <IconAlert className="notification-icon" />
        <div className="point-unread" />
      </AlertButton>
      {toggle.notification && (
        <NotificationList
          txsGroupsInformation={txsGroupsInformation}
          onListToggle={onListToggle}
          breakpoint={breakpoint}
        />
      )}
    </NotificationWrapper>
  );
};

export default NotificationButton;
