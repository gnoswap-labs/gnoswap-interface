import { cx } from "@emotion/css";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import IconTriangleArrowDown from "@components/common/icons/IconTriangleArrowDown";
import IconTriangleArrowUp from "@components/common/icons/IconTriangleArrowUp";
import TableSkeleton from "@components/common/table-skeleton/TableSkeleton";
import AssetInfo from "@components/wallet/asset-info/AssetInfo";
import {
  ASSET_INFO,
  ASSET_INFO_MOBILE,
  ASSET_INFO_TABLET,
} from "@constants/skeleton.constant";
import {
  AssetSortOption,
  ASSET_HEAD,
  type Asset,
} from "@containers/asset-list-container/AssetListContainer";
import { DEVICE_TYPE } from "@styles/media";

import {
  AssetListTableWrapper,
  noDataText,
  TableColumn,
} from "./AssetListTable.styles";

interface AssetListTableProps {
  assets: Asset[];
  isFetched: boolean;
  deposit: (asset: Asset) => void;
  withdraw: (asset: Asset) => void;
  sortOption: AssetSortOption | undefined;
  sort: (head: ASSET_HEAD) => void;
  isSortOption: (head: ASSET_HEAD) => boolean;
  moveTokenPage: (tokenPath: string) => void;
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
  moveTokenPage,
  breakpoint,
}) => {
  const { t } = useTranslation();

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

  const tdWidth = useMemo(() => {
    return breakpoint === DEVICE_TYPE.WEB
      ? ASSET_INFO
      : breakpoint !== DEVICE_TYPE.MOBILE
      ? ASSET_INFO_TABLET
      : ASSET_INFO_MOBILE;
  }, [breakpoint]);

  return (
    <AssetListTableWrapper>
      <div className="asset-list-head">
        {Object.values(ASSET_HEAD).map((head, idx) => (
          <TableColumn
            key={idx}
            className={cx({
              left: tdWidth.list?.[idx]?.left,
              sort: isSortOption(head),
            })}
            tdWidth={tdWidth.list?.[idx]?.width}
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
              {t(head)}
            </span>
          </TableColumn>
        ))}
      </div>
      <div className="asset-list-body">
        {isFetched && assets.length === 0 && (
          <div css={noDataText}>{t("Wallet:assets.empty")}</div>
        )}
        {isFetched &&
          assets.length > 0 &&
          assets.map((asset, idx) => (
            <AssetInfo
              key={idx}
              asset={asset}
              deposit={deposit}
              withdraw={withdraw}
              moveTokenPage={moveTokenPage}
              breakpoint={breakpoint}
            />
          ))}
        {!isFetched && (
          <TableSkeleton
            className="skeleton"
            info={
              breakpoint === DEVICE_TYPE.WEB
                ? ASSET_INFO
                : breakpoint !== DEVICE_TYPE.MOBILE
                ? ASSET_INFO_TABLET
                : ASSET_INFO_MOBILE
            }
            breakpoint={breakpoint}
          />
        )}
      </div>
    </AssetListTableWrapper>
  );
};

export default AssetListTable;
