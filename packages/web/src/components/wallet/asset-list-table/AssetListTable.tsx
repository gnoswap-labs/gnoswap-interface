import {
  type Asset,
  ASSET_HEAD,
} from "@containers/asset-list-container/AssetListContainer";
import AssetInfo from "@components/wallet/asset-info/AssetInfo";
import { AssetListTableWrapper, TableColumn } from "./AssetListTable.styles";
import { noDataText } from "@components/earn/pool-list-table/PoolListTable.styles";
import TableSkeleton from "@components/common/table-skeleton/TableSkeleton";
import { ASSET_INFO, ASSET_TD_WIDTH } from "@constants/skeleton.constant";
import { cx } from "@emotion/css";

interface AssetListTableProps {
  assets: Asset[];
  isFetched: boolean;
  deposit: (assetId: string) => void;
  withdraw: (assetId: string) => void;
}

const AssetListTable: React.FC<AssetListTableProps> = ({
  assets,
  isFetched,
  deposit,
  withdraw,
}) => (
  <AssetListTableWrapper>
    <div className="asset-list-head">
      {Object.values(ASSET_HEAD).map((head, idx) => (
        <TableColumn
          key={idx}
          className={cx([0, 1, 2].includes(idx) && "left")}
          tdWidth={ASSET_TD_WIDTH[idx]}
        >
          <span>{head}</span>
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
          />
        ))}
      {!isFetched && <TableSkeleton info={ASSET_INFO} />}
    </div>
  </AssetListTableWrapper>
);

export default AssetListTable;
