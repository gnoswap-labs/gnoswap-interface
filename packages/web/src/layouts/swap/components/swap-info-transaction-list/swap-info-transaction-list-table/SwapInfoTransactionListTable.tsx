import React from "react";
import Link from "next/link";
import { cx } from "@emotion/css";
import { useTranslation } from "react-i18next";

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
import { useTokenImage } from "@hooks/token/data/use-token-image";

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

const TIME_INTERVALS = {
  SECOND: 1_000,
  MINUTE: 60_000,
  HOUR: 3_600_000,
};

const TIME_THRESHOLDS = {
  MINUTE: 60,
  HOUR: 3_600,
};

const HIGHLIGHT_DURATION = 1_000;
const MAX_DISPLAY_TRANSACTIONS = 10;

const getTableWidths = (breakpoint: DEVICE_TYPE) => {
  if (breakpoint === DEVICE_TYPE.MOBILE) {
    return MOBILE_TRANSACTION_TD_WIDTH;
  }
  if (breakpoint === DEVICE_TYPE.TABLET || breakpoint === DEVICE_TYPE.TABLET_M || breakpoint === DEVICE_TYPE.TABLET_S) {
    return TABLET_TRANSACTION_TD_WIDTH;
  }
  return TRANSACTION_TD_WIDTH;
};

const getNextUpdateInterval = (diffInSeconds: number): number => {
  if (diffInSeconds < TIME_THRESHOLDS.MINUTE) {
    return TIME_INTERVALS.SECOND;
  } else if (diffInSeconds < TIME_THRESHOLDS.HOUR) {
    return TIME_INTERVALS.MINUTE;
  } else {
    return TIME_INTERVALS.HOUR;
  }
};

const SwapInfoTransactionListTable = ({
  breakpoint,
  swapHistory,
  tokenPairParams,
}: SwapInfoTransactionListTableProps) => {
  const { t } = useTranslation();

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
    if (!swapHistory?.length) return;

    // Skip animations during initial load or token pair changes
    if (skipAnimationRef.current) {
      prevSwapHistoryRef.current = swapHistory;
      skipAnimationRef.current = false;
      return;
    }

    // Use hashmaps to improve search performance
    const prevTxHashMap = new Map(prevSwapHistoryRef.current.map(item => [item.txHash, true]));

    // Filter new transactions
    const newTxHashes = swapHistory.filter(item => !prevTxHashMap.has(item.txHash)).map(item => item.txHash);

    if (newTxHashes.length > 0) {
      const newTxSet = new Set(newTxHashes);
      setNewTransactions(newTxSet);

      const timerId = setTimeout(() => {
        setNewTransactions(new Set());
      }, HIGHLIGHT_DURATION);

      // Clean up timers when unmounting components
      return () => clearTimeout(timerId);
    }

    prevSwapHistoryRef.current = swapHistory;
  }, [swapHistory]);

  const getTableHeaders = React.useMemo(
    () => (breakpoint === DEVICE_TYPE.MOBILE ? MOBILE_TABLE_HEAD : TABLE_HEAD),
    [breakpoint],
  );

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
              <span>{t(head)}</span>
            </TableHeader>
          );
        })}
      </TransactionListTableHeader>

      <TransactionListTableList>
        {swapHistory.slice(0, MAX_DISPLAY_TRANSACTIONS).map((item: SwapHistoryItem) => {
          return (
            <TransactionListTableRow
              key={item.txHash}
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
  const { getTokenImage } = useTokenImage();
  const { getTxUrl } = useGnoscanUrl();

  const widths = getTableWidths(breakpoint);
  const isMobile = breakpoint === DEVICE_TYPE.MOBILE;
  const txDate = new Date(data.time);
  const [timeDisplay, setTimeDisplay] = React.useState("");
  const intervalIdRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    const updateTimeDisplay = () => {
      const diffInSeconds = getTimeDiffInSeconds(Date.now(), txDate);
      setTimeDisplay(formatDisplayTime(diffInSeconds));

      const nextUpdateInterval = getNextUpdateInterval(diffInSeconds);

      if (intervalIdRef.current) {
        clearTimeout(intervalIdRef.current);
      }

      intervalIdRef.current = setTimeout(updateTimeDisplay, nextUpdateInterval);
    };

    updateTimeDisplay();

    return () => {
      if (intervalIdRef.current) {
        clearTimeout(intervalIdRef.current);
      }
    };
  }, [txDate, data.time]);

  const formatSwapAmount = React.useCallback((amount: string | number | null | undefined) => {
    if (!amount) return "0";

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
          {data.toUsdValue ? formatPrice(data.fromUsdValue, { lessThan1Significant: 2 }) : "-"}
        </TableColumn>
      )}
      <TableColumn tdWidth={isMobile ? widths[1] : widths[2]}>
        <TokenPairWrapper>
          <div className="token-amount">
            <span>{formatSwapAmount(data.fromTokenAmount)}</span>
            <MissingLogo symbol={data.fromToken.symbol} width={14} url={getTokenImage(data.fromToken.path) || ""} />
          </div>
          <IconRightArrow className="arrow" />
          <div className="token-amount">
            <span>{formatSwapAmount(data.toTokenAmount)}</span>
            <MissingLogo symbol={data.toToken.symbol} width={14} url={getTokenImage(data.toToken.path) || ""} />
          </div>
        </TokenPairWrapper>
      </TableColumn>
    </TransactionListTableRowWrapper>
  );
};

export default SwapInfoTransactionListTable;
