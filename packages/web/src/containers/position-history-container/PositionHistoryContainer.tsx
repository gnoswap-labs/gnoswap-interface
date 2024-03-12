import { useWindowSize } from "@hooks/common/use-window-size";
import React from "react";
import { ValuesType } from "utility-types";

import PositionHistoryList from "@components/pool/position-history-list/PositionHistoryList";
import { useLoading } from "@hooks/common/use-loading";

export interface IHistory {
  timeStamp: string;
  action: string;
  value: string;
  gnsAmount: string;
  gnotAmount: string;
}

export interface SortOption {
  key: TABLE_HEAD;
  direction: "asc" | "desc";
}

export const TABLE_HEAD = {
  TIMESTAMP: "Timestamp",
  ACTION: "Action",
  VALUE: "Value",
  GNS_AMOUNT: "GNS Amount",
  GNOT_AMOUNT: "GNOT Amount",
} as const;
export type TABLE_HEAD = ValuesType<typeof TABLE_HEAD>;

// const SORT_PARAMS: { [key in TABLE_HEAD]: string } = {
//   Action: "action",
//   "Total Value": "total_value",
//   "Token amount": "token_amount",
//   "Token amount ": "token_amount ",
//   Account: "Account",
//   Time: "Time",
// };

export const dummyList: IHistory[] = [
  {
    timeStamp: "Jan 17 2024, 13:12:42",
    action: "Stake Position",
    value: "$12,090.12",
    gnsAmount: "241.240124 GNS",
    gnotAmount: "1.124121 GNOT",
  },
  {
    timeStamp: "Jan 17 2024, 13:12:42",
    action: "Stake Position",
    value: "$12,090.12",
    gnsAmount: "241.240124 GNS",
    gnotAmount: "1.124121 GNOT",
  },
  {
    timeStamp: "Jan 17 2024, 13:12:42",
    action: "Stake Position",
    value: "$12,090.12",
    gnsAmount: "241.240124 GNS",
    gnotAmount: "1.124121 GNOT",
  },
  {
    timeStamp: "Jan 17 2024, 13:12:42",
    action: "Stake Position",
    value: "$12,090.12",
    gnsAmount: "241.240124 GNS",
    gnotAmount: "1.124121 GNOT",
  },
  {
    timeStamp: "Jan 17 2024, 13:12:42",
    action: "Stake Position",
    value: "$12,090.12",
    gnsAmount: "241.240124 GNS",
    gnotAmount: "1.124121 GNOT",
  },
];

const PositionHistoryContainer: React.FC = () => {
  const { breakpoint } = useWindowSize();
  const { isLoadingCommon } = useLoading();

  return (
    <PositionHistoryList
      list={dummyList}
      isFetched={!isLoadingCommon}
      breakpoint={breakpoint}
    />
  );
};

export default PositionHistoryContainer;
