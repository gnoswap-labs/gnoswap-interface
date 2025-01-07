import React from "react";
import { cx } from "@emotion/css";

import {
  MOBILE_TABLE_HEAD,
  TABLE_HEAD,
} from "@layouts/swap/containers/swap-info-transaction-list-container/SwapInfoTransactionListContainer";
import {
  TRANSACTION_TD_WIDTH,
  TABLET_TRANSACTION_TD_WIDTH,
  MOBILE_TRANSACTION_TD_WIDTH,
} from "@constants/skeleton.constant";

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
import { DEVICE_TYPE } from "@styles/media";

interface SwapInfoTransactionListTableProps {
  breakpoint: DEVICE_TYPE;
}

const getTableWidths = (breakpoint: DEVICE_TYPE) => {
  if (breakpoint === DEVICE_TYPE.MOBILE) {
    return MOBILE_TRANSACTION_TD_WIDTH;
  }
  if (breakpoint === DEVICE_TYPE.TABLET || breakpoint === DEVICE_TYPE.TABLET_M || breakpoint === DEVICE_TYPE.TABLET_S) {
    return TABLET_TRANSACTION_TD_WIDTH;
  }
  return TRANSACTION_TD_WIDTH;
};

const SwapInfoTransactionListTable = ({ breakpoint }: SwapInfoTransactionListTableProps) => {
  const getTableHeaders = React.useCallback(() => {
    if (breakpoint === DEVICE_TYPE.MOBILE) {
      return MOBILE_TABLE_HEAD;
    }

    return TABLE_HEAD;
  }, [breakpoint]);

  return (
    <>
      <TransactionListTableHeader>
        {Object.values(getTableHeaders()).map((head, idx) => {
          return (
            <TableHeader
              key={`table-header-${head}`}
              className={cx({ left: idx === 0 })}
              tdWidth={getTableWidths(breakpoint)[idx]}
            >
              <span>{head}</span>
            </TableHeader>
          );
        })}
      </TransactionListTableHeader>

      <TransactionListTableList>
        {[...Array(5)].map((_, index) => (
          // temporarily use index as key for development phase only
          <TransactionListTableRow key={`transaction-list-table-list-${index}`} breakpoint={breakpoint} />
        ))}
      </TransactionListTableList>
    </>
  );
};

const TransactionListTableRow = ({ breakpoint }: { breakpoint: DEVICE_TYPE }) => {
  const today = new Date();
  const widths = getTableWidths(breakpoint);
  const isMobile = breakpoint === DEVICE_TYPE.MOBILE;

  return (
    <TransactionListTableRowWrapper>
      <TableColumn className="left" tdWidth={widths[0]}>
        <DateTimeTooltip date={today}>
          <span>1s ago</span>
        </DateTimeTooltip>
        <button>
          <IconOpenLink size="10px" className="path-link-icon" />
        </button>
      </TableColumn>
      {!isMobile && <TableColumn tdWidth={widths[1]}>$12.05</TableColumn>}
      <TableColumn tdWidth={isMobile ? widths[1] : widths[2]}>
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
