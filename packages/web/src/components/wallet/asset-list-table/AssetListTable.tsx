import {
  type Asset,
  ASSET_HEAD,
  AssetSortOption,
} from "@containers/asset-list-container/AssetListContainer";
import AssetInfo from "@components/wallet/asset-info/AssetInfo";
import { AssetListTableWrapper, TableColumn } from "./AssetListTable.styles";
import { noDataText } from "@components/earn/pool-list-table/PoolListTable.styles";
import TableSkeleton from "@components/common/table-skeleton/TableSkeleton";
import {
  ASSET_INFO,
  ASSET_TD_WIDTH,
  MOBILE_ASSET_TD_WIDTH,
  TABLET_ASSET_TD_WIDTH,
} from "@constants/skeleton.constant";
import { cx } from "@emotion/css";
import { useCallback } from "react";
import IconTriangleArrowDown from "@components/common/icons/IconTriangleArrowDown";
import IconTriangleArrowUp from "@components/common/icons/IconTriangleArrowUp";
import { DEVICE_TYPE } from "@styles/media";

interface AssetListTableProps {
  assets: Asset[];
  isFetched: boolean;
  deposit: (asset: Asset) => void;
  withdraw: (asset: Asset) => void;
  sortOption: AssetSortOption | undefined;
  sort: (head: ASSET_HEAD) => void;
  isSortOption: (head: ASSET_HEAD) => boolean;
  breakpoint: DEVICE_TYPE;
}

const AssetListTable: React.FC<AssetListTableProps> = ({
  assets,
  isFetched,
  deposit,
  withdraw,
  sortOption,
  sort,
  isSortOption,
  breakpoint,
}) => {
  const isAscendingOption = useCallback(
    (head: ASSET_HEAD) => {
      return sortOption?.key === head && sortOption.direction === "asc";
    },
    [sortOption],
  );

  const isDescendingOption = useCallback(
    (head: ASSET_HEAD) => {
      return sortOption?.key === head && sortOption.direction === "desc";
    },
    [sortOption],
  );

  const onClickTableHead = (head: ASSET_HEAD) => {
    if (!isSortOption(head)) {
      return;
    }
    sort(head);
  };

  const isAlignLeft = (head: ASSET_HEAD) => {
    return (
      ASSET_HEAD.ASSET === head ||
      ASSET_HEAD.BALANCE === head ||
      ASSET_HEAD.CHAIN === head
    );
  };
  return (
    <AssetListTableWrapper>
      <div className="asset-list-head">
        {Object.values(ASSET_HEAD).map((head, idx) => (
          <TableColumn
            key={idx}
            className={cx({
              left: isAlignLeft(head),
              sort: isSortOption(head),
            })}
            tdWidth={
              breakpoint === DEVICE_TYPE.WEB
                ? ASSET_TD_WIDTH[idx]
                : breakpoint === DEVICE_TYPE.TABLET
                ? TABLET_ASSET_TD_WIDTH[idx]
                : MOBILE_ASSET_TD_WIDTH[idx]
            }
          >
            <span
              className={Object.keys(ASSET_HEAD)[idx].toLowerCase()}
              onClick={() => onClickTableHead(head)}
            >
              {isAscendingOption(head) && (
                <IconTriangleArrowUp className="icon asc" />
              )}
              {isDescendingOption(head) && (
                <IconTriangleArrowDown className="icon desc" />
              )}
              {head}
            </span>
          </TableColumn>
        ))}
      </div>
      <div className="asset-list-body">
        {isFetched && assets.length === 0 && (
          <div css={noDataText}>No data found</div>
        )}
        {isFetched &&
          assets.length > 0 &&
          assets.map((asset, idx) => (
            <AssetInfo
              key={idx}
              asset={asset}
              deposit={deposit}
              withdraw={withdraw}
              breakpoint={breakpoint}
            />
          ))}
        {!isFetched && <TableSkeleton info={ASSET_INFO} />}
      </div>
    </AssetListTableWrapper>
  );
};

export default AssetListTable;
