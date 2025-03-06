import React from "react";
import Link from "next/link";
import { cx } from "@emotion/css";

import {
  MOBILE_TABLE_HEAD,
  TABLE_HEAD,
  TokenPairParams,
} from "@layouts/swap/containers/swap-info-transaction-list-container/SwapInfoTransactionListContainer";
import {
  TRANSACTION_TD_WIDTH,
  TABLET_TRANSACTION_TD_WIDTH,
  MOBILE_TRANSACTION_TD_WIDTH,
} from "@constants/skeleton.constant";
import { DEVICE_TYPE } from "@styles/media";
import { SwapHistoryItem } from "@repositories/swap/response/swap-history-response";
import { formatDisplayTime, getTimeDiffInSeconds } from "@common/utils/date-util";
import { formatPrice, formatTokenAmount, removeTrailingZeros } from "@utils/new-number-utils";
import { useGnoscanUrl } from "@hooks/common/use-gnoscan-url";

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
import DateTimeTooltip from "@components/common/date-time-tooltip/DateTimeTooltip";

interface SwapInfoTransactionListTableProps {
  breakpoint: DEVICE_TYPE;
  swapHistory: SwapHistoryItem[];
  tokenPairParams: TokenPairParams;
}

interface TransactionListTableRowProps {
  breakpoint: DEVICE_TYPE;
  data: SwapHistoryItem;
  isNewTransaction?: boolean;
}

const HIGHLIGHT_DURATION = 1_000;

const TIME_UPDATE_INTERVAL = 1_000;

const getTableWidths = (breakpoint: DEVICE_TYPE) => {
  if (breakpoint === DEVICE_TYPE.MOBILE) {
    return MOBILE_TRANSACTION_TD_WIDTH;
  }
  if (breakpoint === DEVICE_TYPE.TABLET || breakpoint === DEVICE_TYPE.TABLET_M || breakpoint === DEVICE_TYPE.TABLET_S) {
    return TABLET_TRANSACTION_TD_WIDTH;
  }
  return TRANSACTION_TD_WIDTH;
};

const SwapInfoTransactionListTable = ({
  breakpoint,
  swapHistory,
  tokenPairParams,
}: SwapInfoTransactionListTableProps) => {
  const prevSwapHistoryRef = React.useRef<SwapHistoryItem[]>([]);
  const [newTransactions, setNewTransactions] = React.useState<Set<string>>(new Set());
  const skipAnimationRef = React.useRef(true); // Skip animation on initial load or token pair change

  // Reset animation when changing token pairs
  React.useEffect(() => {
    skipAnimationRef.current = true;
    setNewTransactions(new Set());
  }, [tokenPairParams]);

  // Detect and highlight new transactions
  React.useEffect(() => {
    if (swapHistory) {
      // Skip animations during initial load or token pair changes
      if (skipAnimationRef.current) {
        prevSwapHistoryRef.current = swapHistory;
        skipAnimationRef.current = false;
        return;
      }

      // Find new transactions by comparing them to the list of previous transactions
      const prevTxHashes = new Set(prevSwapHistoryRef.current.map(item => item.txHash));
      const newTransactions = new Set<string>();

      swapHistory.forEach(item => {
        if (!prevTxHashes.has(item.txHash)) {
          newTransactions.add(item.txHash);
        }
      });

      if (newTransactions.size > 0) {
        setNewTransactions(newTransactions);
        setTimeout(() => {
          setNewTransactions(new Set());
        }, HIGHLIGHT_DURATION);
      }

      prevSwapHistoryRef.current = swapHistory;
    }
  }, [swapHistory]);

  const getTableHeaders = React.useMemo(() => {
    if (breakpoint === DEVICE_TYPE.MOBILE) {
      return MOBILE_TABLE_HEAD;
    }

    return TABLE_HEAD;
  }, [breakpoint]);

  return (
    <>
      <TransactionListTableHeader>
        {Object.values(getTableHeaders).map((head, idx) => {
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
        {swapHistory.slice(0, 10).map((item: SwapHistoryItem, index: number) => {
          return (
            <TransactionListTableRow
              key={`transaction-list-table-list-${index}`}
              data={item}
              breakpoint={breakpoint}
              isNewTransaction={newTransactions.has(item.txHash)}
            />
          );
        })}
      </TransactionListTableList>
    </>
  );
};

const TransactionListTableRow = ({ breakpoint, data, isNewTransaction }: TransactionListTableRowProps) => {
  const { getTxUrl } = useGnoscanUrl();

  const widths = getTableWidths(breakpoint);
  const isMobile = breakpoint === DEVICE_TYPE.MOBILE;
  const txDate = new Date(data.time);
  const [timeDisplay, setTimeDisplay] = React.useState("");

  React.useEffect(() => {
    const updateTimeDisplay = () => {
      const diffInSeconds = getTimeDiffInSeconds(txDate);
      setTimeDisplay(formatDisplayTime(diffInSeconds));
    };

    updateTimeDisplay();

    const intervalId = setInterval(updateTimeDisplay, TIME_UPDATE_INTERVAL);

    return () => clearInterval(intervalId);
  }, [txDate, data.time]);

  const formatSwapAmount = React.useCallback((amount: string) => {
    const formatted = formatTokenAmount(amount, {
      decimals: 2,
      minLimit: 0.01,
      isKMB: true,
    });
    return removeTrailingZeros(formatted);
  }, []);

  return (
    <TransactionListTableRowWrapper className={cx({ highlight: isNewTransaction })}>
      <TableColumn className="left" tdWidth={widths[0]}>
        <DateTimeTooltip date={txDate}>
          <span>{timeDisplay}</span>
        </DateTimeTooltip>
        <Link href={getTxUrl(data.txHash)} target={"_blank"} aria-label={`Transaction ${data.txHash} details link`}>
          <IconOpenLink size="10px" className="path-link-icon" />
        </Link>
      </TableColumn>
      {!isMobile && (
        <TableColumn tdWidth={widths[1]}>
          {" "}
          {data.toUsdValue ? formatPrice(data.toUsdValue, { lessThan1Significant: 2 }) : "-"}
        </TableColumn>
      )}
      <TableColumn tdWidth={isMobile ? widths[1] : widths[2]}>
        <TokenPairWrapper>
          <div className="token-amount">
            <span>{formatSwapAmount(data.fromTokenAmount)}</span>
            <MissingLogo symbol={data.fromToken.symbol} width={14} url={data.fromToken.logoURI} />
          </div>
          <IconRightArrow className="arrow" />
          <div className="token-amount">
            <span>{formatSwapAmount(data.toTokenAmount)}</span>
            <MissingLogo symbol={data.toToken.symbol} width={14} url={data.toToken.logoURI} />
          </div>
        </TokenPairWrapper>
      </TableColumn>
    </TransactionListTableRowWrapper>
  );
};

export default SwapInfoTransactionListTable;
