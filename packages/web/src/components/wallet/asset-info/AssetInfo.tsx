import { useCallback } from "react";
import IconDownload from "@components/common/icons/IconDownload";
import IconUpload from "@components/common/icons/IconUpload";
import { Asset } from "@containers/asset-list-container/AssetListContainer";
import { AssetInfoWrapper } from "./AssetInfo.styles";

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
      <div className="column">
        <img className="logo" src={logoUri} alt="logo" />
        <span className="name">{name}</span>
        <span className="symbol">{symbol}</span>
      </div>
      <div className="column">
        <span className="chain">{chain}</span>
      </div>
      <div className="column">
        <span className="balance">{balance}</span>
      </div>
      <div className="column right">
        <button className="deposit" onClick={onClickDeposit}>
          <IconDownload />
          Deposit
        </button>
      </div>
      <div className="column right">
        <button className="withdraw" onClick={onClickWithdraw}>
          <IconUpload />
          Withdraw
        </button>
      </div>
    </AssetInfoWrapper>
  );
};

export default AssetInfo;
