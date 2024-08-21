import { useCallback, useMemo } from "react";

import TokenInfoCell from "@components/common/token-info-cell/TokenInfoCell";
import { DepositButton } from "@components/wallet/buttons/DepositButton";
import { WithdrawButton } from "@components/wallet/buttons/WithdrawButton";
import {
  ASSET_INFO,
  ASSET_INFO_MOBILE,
  ASSET_INFO_TABLET,
} from "@constants/skeleton.constant";
import { isNativeToken } from "@models/token/token-model";
import { DEVICE_TYPE } from "@styles/media";

import { Asset } from "../AssetListTable";

import { AssetInfoWrapper, TableColumn } from "./AssetInfo.styles";

export interface AssetInfoProps {
  asset: Asset;
  deposit: (asset: Asset) => void;
  withdraw: (asset: Asset) => void;
  moveTokenPage: (tokenPath: string) => void;
  breakpoint: DEVICE_TYPE;
}

const AssetInfo: React.FC<AssetInfoProps> = ({
  asset,
  deposit,
  withdraw,
  moveTokenPage,
  breakpoint,
}) => {
  const { balance, type, path, price } = asset;

  const onClickItem = useCallback((path: string) => {
    moveTokenPage(path);
  }, []);

  const onClickDeposit = useCallback(() => {
    deposit(asset);
  }, [deposit, asset]);

  const onClickWithdraw = useCallback(() => {
    withdraw(asset);
  }, [withdraw, asset]);

  const tokenInfoCell = useMemo(
    () => (
      <TokenInfoCell
        token={asset}
        isNative={isNativeToken(asset)}
        breakpoint={breakpoint}
      />
    ),
    [asset, breakpoint],
  );

  return breakpoint === DEVICE_TYPE.WEB ? (
    <AssetInfoWrapper>
      <TableColumn
        id={asset.symbol}
        className="name-col left pointer"
        tdWidth={ASSET_INFO.list?.[0].width}
        onClick={() => onClickItem(path)}
      >
        {tokenInfoCell}
      </TableColumn>
      <TableColumn className="left" tdWidth={ASSET_INFO.list?.[1].width}>
        <span className="chain">
          {type === "grc20" ? "Gnoland (GRC20)" : "Gnoland (Native)"}
        </span>
      </TableColumn>
      <TableColumn className="left" tdWidth={ASSET_INFO.list?.[2].width}>
        <span className="balance">{balance}</span>
      </TableColumn>
      <TableColumn className="left" tdWidth={ASSET_INFO.list?.[3].width}>
        <span className="balance">{price}</span>
      </TableColumn>
      <TableColumn tdWidth={ASSET_INFO.list?.[4].width}>
        <DepositButton onClick={onClickDeposit} />
      </TableColumn>
      <TableColumn tdWidth={ASSET_INFO.list?.[5].width}>
        <WithdrawButton onClick={onClickWithdraw} />
      </TableColumn>
    </AssetInfoWrapper>
  ) : breakpoint !== DEVICE_TYPE.MOBILE ? (
    <AssetInfoWrapper>
      <TableColumn
        className="name-col left"
        tdWidth={ASSET_INFO_TABLET.list[0].width}
        onClick={() => onClickItem(path)}
      >
        {tokenInfoCell}
      </TableColumn>
      <TableColumn className="left" tdWidth={ASSET_INFO_TABLET.list[1].width}>
        <span className="chain">
          {type === "grc20" ? "Gnoland (GRC20)" : "Gnoland (Native)"}
        </span>
      </TableColumn>
      <TableColumn className="left" tdWidth={ASSET_INFO_TABLET.list[2].width}>
        <span className="balance">{balance}</span>
      </TableColumn>
      <TableColumn className="left" tdWidth={ASSET_INFO_TABLET.list[3].width}>
        <span className="balance">{price}</span>
      </TableColumn>
      <TableColumn tdWidth={ASSET_INFO_TABLET.list[4].width}>
        <DepositButton onClick={onClickDeposit} />
      </TableColumn>
      <TableColumn tdWidth={ASSET_INFO_TABLET.list[5].width}>
        <WithdrawButton onClick={onClickWithdraw} />
      </TableColumn>
    </AssetInfoWrapper>
  ) : (
    <AssetInfoWrapper>
      <TableColumn
        className="name-col left"
        tdWidth={ASSET_INFO_MOBILE.list[0].width}
        onClick={() => onClickItem(path)}
      >
        {tokenInfoCell}
      </TableColumn>
      <TableColumn className="left" tdWidth={ASSET_INFO_MOBILE.list[1].width}>
        <span className="chain">
          {type === "grc20" ? "Gnoland (GRC20)" : "Gnoland (Native)"}
        </span>
      </TableColumn>
      <TableColumn className="left" tdWidth={ASSET_INFO_MOBILE.list[2].width}>
        <span className="balance">{balance}</span>
      </TableColumn>
      <TableColumn className="left" tdWidth={ASSET_INFO_MOBILE.list[3].width}>
        <span className="balance">{price}</span>
      </TableColumn>
      <TableColumn tdWidth={ASSET_INFO_MOBILE.list[4].width}>
        <DepositButton onClick={onClickDeposit} />
      </TableColumn>
      <TableColumn tdWidth={ASSET_INFO_MOBILE.list[5].width}>
        <WithdrawButton onClick={onClickWithdraw} />
      </TableColumn>
    </AssetInfoWrapper>
  );
};

export default AssetInfo;
