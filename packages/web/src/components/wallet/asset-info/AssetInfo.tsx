import { useCallback } from "react";
import IconDownload from "@components/common/icons/IconDownload";
import IconUpload from "@components/common/icons/IconUpload";
import { Asset } from "@containers/asset-list-container/AssetListContainer";
import { AssetInfoWrapper, LoadButton, TableColumn } from "./AssetInfo.styles";
import { ASSET_TD_WIDTH } from "@constants/skeleton.constant";

interface AssetInfoProps {
  asset: Asset;
  deposit: (assetId: string) => void;
  withdraw: (assetId: string) => void;
}

const AssetInfo: React.FC<AssetInfoProps> = ({ asset, deposit, withdraw }) => {
  const { id, logoUri, name, symbol, chain, balance } = asset;

  const onClickDeposit = useCallback(() => {
    deposit(id);
  }, [deposit, id]);

  const onClickWithdraw = useCallback(() => {
    withdraw(id);
  }, [withdraw, id]);

  return (
    <AssetInfoWrapper>
      <TableColumn className="left" tdWidth={ASSET_TD_WIDTH[0]}>
        <img className="logo" src={logoUri} alt="logo" />
        <span className="name">{name}</span>
        <span className="symbol">{symbol}</span>
      </TableColumn>
      <TableColumn className="left" tdWidth={ASSET_TD_WIDTH[1]}>
        <span className="chain">{chain}</span>
      </TableColumn>
      <TableColumn className="left" tdWidth={ASSET_TD_WIDTH[2]}>
        <span className="balance">{balance}</span>
      </TableColumn>
      <TableColumn tdWidth={ASSET_TD_WIDTH[3]}>
        <DepositButton onClick={onClickDeposit} />
      </TableColumn>
      <TableColumn tdWidth={ASSET_TD_WIDTH[4]}>
        <WithdrawButton onClick={onClickWithdraw} />
      </TableColumn>
    </AssetInfoWrapper>
  );
};

export const DepositButton = ({
  onClick,
  disabled = false,
}: {
  onClick: () => void;
  disabled?: boolean;
}) => (
  <LoadButton onClick={onClick} disabled={disabled}>
    <IconDownload />
    <span>Deposit</span>
  </LoadButton>
);

export const WithdrawButton = ({
  onClick,
  disabled = false,
}: {
  onClick: () => void;
  disabled?: boolean;
}) => (
  <LoadButton onClick={onClick} disabled={disabled}>
    <IconUpload className="upload" />
    <span>Withdraw</span>
  </LoadButton>
);

export default AssetInfo;
