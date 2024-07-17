import React, { useCallback } from "react";
import {
  PoolSortOption,
  SORT_SUPPORT_HEAD,
  TABLE_HEAD,
} from "@containers/pool-list-container/PoolListContainer";
import PoolInfo from "@components/earn/pool-info/PoolInfo";
import { noDataText, TableColumn, TableWrapper } from "./PoolListTable.styles";
import { cx } from "@emotion/css";
import TableSkeleton from "@components/common/table-skeleton/TableSkeleton";
import {
  POOL_INFO,
  POOL_INFO_MOBILE,
  POOL_INFO_SMALL_TABLET,
  POOL_INFO_TABLET,
} from "@constants/skeleton.constant";
import IconTriangleArrowUp from "@components/common/icons/IconTriangleArrowUp";
import IconTriangleArrowDown from "@components/common/icons/IconTriangleArrowDown";
import { PoolListInfo } from "@models/pool/info/pool-list-info";
import { DEVICE_TYPE } from "@styles/media";
import { useTranslation } from "react-i18next";

interface PoolListTableProps {
  pools: PoolListInfo[];
  isFetched: boolean;
  sortOption: PoolSortOption | undefined;
  sort: (head: TABLE_HEAD) => void;
  isSortOption: (head: TABLE_HEAD) => boolean;
  routeItem: (id: string) => void;
  themeKey: "dark" | "light";
  breakpoint: DEVICE_TYPE;
}

const PoolListTable: React.FC<PoolListTableProps> = ({
  pools,
  isFetched,
  sortOption,
  sort,
  isSortOption,
  routeItem,
  themeKey,
  breakpoint,
}) => {
  const { t } = useTranslation();

  const isAscendingOption = useCallback(
    (head: TABLE_HEAD) => {
      return sortOption?.key === head && sortOption.direction === "asc";
    },
    [sortOption],
  );

  const isDescendingOption = useCallback(
    (head: TABLE_HEAD) => {
      return sortOption?.key === head && sortOption.direction === "desc";
    },
    [sortOption],
  );

  const onClickTableHead = (head: TABLE_HEAD) => {
    if (!isSortOption(head)) {
      return;
    }
    sort(head);
  };

  const isAlignLeft = (head: TABLE_HEAD) => {
    return TABLE_HEAD.POOL_NAME === head;
  };

  const poolInfo =
    breakpoint === DEVICE_TYPE.MOBILE
      ? POOL_INFO_MOBILE
      : breakpoint === DEVICE_TYPE.TABLET_M
      ? POOL_INFO_SMALL_TABLET
      : breakpoint === DEVICE_TYPE.TABLET
      ? POOL_INFO_TABLET
      : POOL_INFO;

  return (
    <TableWrapper>
      <div className="pool-list-head">
        {Object.values(TABLE_HEAD).map((head, idx) => {
          const canSort = SORT_SUPPORT_HEAD.includes(head);

          return (
            <TableColumn
              key={idx}
              className={cx({
                left: isAlignLeft(head),
                sort: isSortOption(head) && canSort,
              })}
              tdWidth={poolInfo.list[idx].width}
            >
              <span
                className={Object.keys(TABLE_HEAD)[idx].toLowerCase()}
                onClick={canSort ? () => onClickTableHead(head) : undefined}
              >
                {canSort && (
                  <>
                    {isAscendingOption(head) && (
                      <IconTriangleArrowUp className="icon asc" />
                    )}
                    {isDescendingOption(head) && (
                      <IconTriangleArrowDown className="icon desc" />
                    )}
                  </>
                )}
                {t(head)}
              </span>
            </TableColumn>
          );
        })}
      </div>
      <div className="pool-list-body">
        {isFetched && pools.length === 0 && (
          <div css={noDataText}>{t("Earn:poolList.noPool")}</div>
        )}
        {isFetched &&
          pools.length > 0 &&
          pools.map((pool, idx) => (
            <PoolInfo
              pool={pool}
              key={idx}
              routeItem={routeItem}
              themeKey={themeKey}
              breakpoint={breakpoint}
            />
          ))}
        {!isFetched && <TableSkeleton info={poolInfo} />}
      </div>
    </TableWrapper>
  );
};

export default PoolListTable;
