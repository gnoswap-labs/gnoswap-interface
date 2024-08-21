import { cx } from "@emotion/css";
import React from "react";
import { useTranslation } from "react-i18next";

import TableSkeleton from "@components/common/table-skeleton/TableSkeleton";
import {
  MOBILE_POSITION_HISTORY_INFO,
  POSITION_HISTORY_INFO,
  TableInfoType,
  TABLET_POSITION_HISTORY_INFO,
} from "@constants/skeleton.constant";
import { IPositionHistoryModel } from "@models/position/position-history-model";
import { DEVICE_TYPE } from "@styles/media";

import { TABLE_HEAD } from "../../../containers/position-history-container/PositionHistoryContainer";
import PositionInfo from "./position-info/PositionInfo";

import {
  noDataText,
  TableHeader,
  TableWrapper
} from "./PositionHistoryTable.styles";

interface PositionHistoryTableProps {
  list: IPositionHistoryModel[];
  isFetched: boolean;
  breakpoint: DEVICE_TYPE;
  isLoading: boolean;
}

const PositionHistoryTable: React.FC<PositionHistoryTableProps> = ({
  list,
  isFetched,
  breakpoint,
  isLoading,
}) => {
  const { t } = useTranslation();

  const sekeleton: TableInfoType =
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
              tdWidth={sekeleton.list[idx]?.width ?? 0}
            >
              <span className={Object.keys(TABLE_HEAD)[idx].toLowerCase()}>
                {idx === 3 || idx === 4
                  ? `${t("business:token")} ${t("business:amount")}`
                  : t(head)}
              </span>
            </TableHeader>
          ))}
        </div>
        <div className="position-history-list-body">
          {isFetched && list.length === 0 && (
            <div css={noDataText}>{t("Pool:position.card.history.empty")}</div>
          )}
          {isFetched &&
            !isLoading &&
            list.length > 0 &&
            list.map((item, idx) => (
              <PositionInfo item={item} key={idx} breakpoint={breakpoint} />
            ))}
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
