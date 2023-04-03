import { Asset } from "@containers/asset-list-container/AssetListContainer";
import AssetInfo from "@components/wallet/asset-info/AssetInfo";
import {
  AssetListTableRowWrapper,
  AssetListTableWrapper,
} from "./AssetListTable.styles";
import { noDataText } from "@components/earn/pool-list-table/PoolListTable.styles";
import TableSkeleton from "@components/common/table-skeleton/TableSkeleton";

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
    <AssetListTableHead />
    <AssetListTableBody
      assets={assets}
      isFetched={isFetched}
      deposit={deposit}
      withdraw={withdraw}
    />
  </AssetListTableWrapper>
);

const AssetListTableHead: React.FC = () => (
  <AssetListTableRowWrapper>
    <div className="column">Asset</div>
    <div className="column">Chain</div>
    <div className="column">Balance</div>
    <div className="column right">Deposit</div>
    <div className="column right">Withdraw</div>
  </AssetListTableRowWrapper>
);

const AssetListTableBody: React.FC<AssetListTableProps> = ({
  assets,
  isFetched,
  deposit,
  withdraw,
}) => (
  <div className="body">
    {isFetched && !Boolean(assets.length) && (
      <div css={noDataText}>No data found</div>
    )}
    {isFetched &&
      Boolean(assets.length) &&
      assets.map((item, idx) => (
        <AssetInfo
          key={idx}
          asset={item}
          deposit={deposit}
          withdraw={withdraw}
        />
      ))}
    {!isFetched && <TableSkeleton />}
  </div>
);

export default AssetListTable;
