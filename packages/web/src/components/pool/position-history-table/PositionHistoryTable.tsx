import TableSkeleton from "@components/common/table-skeleton/TableSkeleton";
import {
  MOBILE_POSITION_HISTORY_INFO,
  MOBILE_POSITION_HISTORY_TD_WIDTH,
  POSITION_HISTORY_INFO,
  POSITION_HISTORY_TD_WIDTH,
  TABLET_POSITION_HISTORY_INFO,
  TABLET_POSITION_HISTORY_TD_WIDTH
} from "@constants/skeleton.constant";
import {
  TABLE_HEAD,
} from "@containers/position-history-container/PositionHistoryContainer";
import { cx } from "@emotion/css";
import { DEVICE_TYPE } from "@styles/media";
import React from "react";
import PositionInfo from "../position-info/PositionInfo";
import {
  TableHeader,
  TableWrapper,
  noDataText
} from "./PositionHistoryTable.styles";
import { TokenModel } from "@models/token/token-model";
import { IPositionHistoryModel } from "@models/position/position-history-model";

interface PositionHistoryTableProps {
  list: IPositionHistoryModel[];
  isFetched: boolean;
  breakpoint: DEVICE_TYPE;
  tokenA: TokenModel;
  tokenB: TokenModel;
  isLoading: boolean;
}

const PositionHistoryTable: React.FC<PositionHistoryTableProps> = ({
  list,
  isFetched,
  breakpoint,
  tokenA,
  tokenB,
  isLoading,
}) => {
  console.log("🚀 ~ list:", list);
  const td =
    breakpoint === DEVICE_TYPE.MOBILE
      ? MOBILE_POSITION_HISTORY_TD_WIDTH
      : breakpoint === DEVICE_TYPE.TABLET || breakpoint === DEVICE_TYPE.TABLET_M
        ? TABLET_POSITION_HISTORY_TD_WIDTH
        : POSITION_HISTORY_TD_WIDTH;

  const sekeleton: any =
    breakpoint === DEVICE_TYPE.MOBILE
      ? MOBILE_POSITION_HISTORY_INFO
      : breakpoint === DEVICE_TYPE.TABLET || breakpoint === DEVICE_TYPE.TABLET_M
        ? TABLET_POSITION_HISTORY_INFO
        : POSITION_HISTORY_INFO;
  return (
    <TableWrapper>
      <div className="scroll-wrapper">
        <div className="position-history-list-head">
          {Object.values(TABLE_HEAD).map((head, idx) => (
            <TableHeader
              key={idx}
              className={cx({
                left: idx < 2,
                right: idx > 1,
              })}
              tdWidth={td[idx]}
            >
              <span className={Object.keys(TABLE_HEAD)[idx].toLowerCase()}>
                {idx === 3 ? `${tokenA?.symbol} Amount` : idx === 4 ? `${tokenB?.symbol} Amount` : head}
              </span>
            </TableHeader>
          ))}
        </div>
        <div className="position-history-list-body">
          {isFetched && list.length === 0 && (
            <div css={noDataText}>No position history found</div>
          )}
          {(isFetched && !isLoading) &&
            list.length > 0 &&
            list.map((item, idx) =>
              <PositionInfo
                item={item}
                key={idx}
                breakpoint={breakpoint}
                tokenASymbol={tokenA.symbol}
                tokenBSymbol={tokenB.symbol} />
            )}
          {isLoading && (
            <TableSkeleton
              info={sekeleton}
              className="position-history-table"
            />
          )}
        </div>
      </div>
    </TableWrapper>
  );
};

export default PositionHistoryTable;
