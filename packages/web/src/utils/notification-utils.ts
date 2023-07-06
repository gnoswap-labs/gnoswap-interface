import dayjs from "dayjs";
import { TransactionModel } from "@models/account/account-history-model";
import { TransactionGroupsType } from "@components/common/notification-button/NotificationButton";

export const notificationDummyList: Array<TransactionModel> = [
  {
    txType: 0,
    txHash: "0",
    tokenInfo: {
      tokenId: "1",
      name: "test1",
      symbol: "TEST1",
      tokenLogo: "",
    },
    status: "SUCCESS",
    createdAt: new Date(
      new Date().setDate(new Date().getDate() - 40),
    ).toString(),
    content: "Unwrapped 2.01821423 GNOT",
  },
  {
    txType: 1,
    txHash: "1",
    tokenInfo: {
      tokenId: "2",
      name: "test2",
      symbol: "TEST2",
      tokenLogo: "",
    },
    status: "PENDING",
    createdAt: new Date(
      new Date().setDate(new Date().getDate() - 31),
    ).toString(),
    content: "Unwrapped 2.01821423 GNOT",
  },
  {
    txType: 2,
    txHash: "2",
    tokenInfo: {
      tokenId: "3",
      name: "test3",
      symbol: "TEST3",
      tokenLogo: "",
    },
    status: "FAILED",
    createdAt: new Date(
      new Date().setDate(new Date().getDate() - 30),
    ).toString(),
    content: "Unstaked 2.01821423 GNOT",
  },
  {
    txType: 1,
    txHash: "3",
    tokenInfo: {
      tokenId: "3",
      name: "test3",
      symbol: "TEST3",
      tokenLogo: "",
    },
    status: "FAILED",
    createdAt: new Date(
      new Date().setDate(new Date().getDate() - 29),
    ).toString(),
    content: "Added 2.01821423 GNOT to GNOT/GNOS Pool",
  },
  {
    txType: 4,
    txHash: "4",
    tokenInfo: {
      tokenId: "3",
      name: "test3",
      symbol: "TEST3",
      tokenLogo: "",
    },
    status: "SUCCESS",
    createdAt: new Date(
      new Date().setDate(new Date().getDate() - 8),
    ).toString(),
    content: "Removed 2.01821423 GNOT and 1.0352 GNOS",
  },
  {
    txType: 5,
    txHash: "5",
    tokenInfo: {
      tokenId: "3",
      name: "test3",
      symbol: "TEST3",
      tokenLogo: "",
    },
    status: "PENDING",
    createdAt: new Date(
      new Date().setDate(new Date().getDate() - 7),
    ).toString(),
    content: "Created GNOT/GNOS Pool",
  },
  {
    txType: 1,
    txHash: "6",
    tokenInfo: {
      tokenId: "3",
      name: "test3",
      symbol: "TEST3",
      tokenLogo: "",
    },
    status: "SUCCESS",
    createdAt: new Date(
      new Date().setDate(new Date().getDate() - 6),
    ).toString(),
    content: "Added 2.01821423 GNOT to GNOT/GNOS Pool",
  },
  {
    txType: 7,
    txHash: "7",
    tokenInfo: {
      tokenId: "3",
      name: "test3",
      symbol: "TEST3",
      tokenLogo: "",
    },
    status: "SUCCESS",
    createdAt: new Date().toString(),
    content: "Approved GNOT",
  },
];

export const getTransactionGroups = (txs: Array<TransactionModel>) => {
  const now = dayjs();
  const today: Array<TransactionModel> = [];
  const currentWeek: Array<TransactionModel> = [];
  const last30Days: Array<TransactionModel> = [];
  const after30Days: Array<TransactionModel> = [];
  const listMap: { [key: string]: Array<TransactionModel> } = {};

  txs.forEach(tx => {
    const { createdAt } = tx;
    const curr = dayjs(createdAt);
    const diffD = now.diff(curr, "day");

    if (diffD === 0) {
      today.push(tx);
    } else if (diffD >= 1 && diffD <= 7) {
      currentWeek.push(tx);
    } else if (diffD >= 8 && diffD <= 30) {
      last30Days.push(tx);
    } else if (diffD >= 31) {
      after30Days.push(tx);
    }
  });

  const transactionGroups: Array<TransactionGroupsType> = [
    {
      title: "Today",
      txs: today,
    },
    {
      title: "Past 7 Days",
      txs: currentWeek,
    },
    {
      title: "Past 30 Days",
      txs: last30Days,
    },
    {
      title: "More than a month ago",
      txs: after30Days,
    },
  ];

  const sortedList = Object.keys(listMap)
    .sort((a, b) => parseInt(b) - parseInt(a))
    .map(year => ({ title: year, txs: listMap[year] }));

  transactionGroups.push(...sortedList);
  return transactionGroups.filter(txsGroup => txsGroup.txs.length > 0);
};
