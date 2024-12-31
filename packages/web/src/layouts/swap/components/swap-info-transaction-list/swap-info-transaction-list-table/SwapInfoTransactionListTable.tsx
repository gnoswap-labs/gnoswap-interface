import React from "react";
import { cx } from "@emotion/css";

import { TABLE_HEAD } from "@layouts/swap/containers/swap-info-transaction-list-container/SwapInfoTransactionListContainer";
import { TRANSACTION_TD_WIDTH } from "@constants/skeleton.constant";

import {
  TableHeader,
  TableColumn,
  TransactionListTableHeader,
  TransactionListTableList,
  TransactionListTableRowWrapper,
  TokenPairWrapper,
} from "./SwapInfoTransactionListTable.styles";
import IconOpenLink from "@components/common/icons/IconOpenLink";
import IconRightArrow from "@components/common/icons/IconRightArrow";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { GNOT_TOKEN_DEFAULT } from "@common/values/token-constant";
import DateTimeTooltip from "@components/common/date-time-tooltip/DateTimeTooltip";

const SwapInfoTransactionListTable = () => {
  return (
    <>
      <TransactionListTableHeader>
        {Object.values(TABLE_HEAD).map((head, idx) => {
          return (
            <TableHeader
              key={`table-header-${head}`}
              className={cx({ left: idx === 0 })}
              tdWidth={TRANSACTION_TD_WIDTH[idx]}
            >
              <span>{head}</span>
            </TableHeader>
          );
        })}
      </TransactionListTableHeader>

      <TransactionListTableList>
        <TransactionListTableRow />
        <TransactionListTableRow />
        <TransactionListTableRow />
        <TransactionListTableRow />
        <TransactionListTableRow />
      </TransactionListTableList>
      <TransactionListTableRow />
    </>
  );
};

const TransactionListTableRow = () => {
  const today = new Date();
  return (
    <TransactionListTableRowWrapper>
      <TableColumn className="left" tdWidth={TRANSACTION_TD_WIDTH[0]}>
        <DateTimeTooltip date={today}>
          <span>1s ago</span>
        </DateTimeTooltip>
        <button>
          <IconOpenLink size="10px" />
        </button>
      </TableColumn>
      <TableColumn tdWidth={TRANSACTION_TD_WIDTH[1]}>$12.05</TableColumn>
      <TableColumn tdWidth={TRANSACTION_TD_WIDTH[2]}>
        <TokenPairWrapper>
          <div className="token-amount">
            <span>152.15</span>
            <MissingLogo symbol={GNOT_TOKEN_DEFAULT.symbol} width={14} url={GNOT_TOKEN_DEFAULT.logoURI} />
          </div>
          <IconRightArrow className="arrow" />
          <div className="token-amount">
            <span>5.15K</span>
            <MissingLogo symbol={GNOT_TOKEN_DEFAULT.symbol} width={14} url={GNOT_TOKEN_DEFAULT.logoURI} />
          </div>
        </TokenPairWrapper>
      </TableColumn>
    </TransactionListTableRowWrapper>
  );
};

export default SwapInfoTransactionListTable;
