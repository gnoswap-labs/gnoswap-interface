import { useCallback, useMemo } from "react";
import IconDownload from "@components/common/icons/IconDownload";
import IconUpload from "@components/common/icons/IconUpload";
import { Asset } from "@containers/asset-list-container/AssetListContainer";
import { AssetInfoWrapper, LoadButton, TableColumn } from "./AssetInfo.styles";
import { DEVICE_TYPE } from "@styles/media";
import BigNumber from "bignumber.js";
import { makeId } from "@utils/common";
import { isNativeToken } from "@models/token/token-model";
import {
  ASSET_INFO,
  ASSET_INFO_MOBILE,
  ASSET_INFO_TABLET,
} from "@constants/skeleton.constant";
import TokenInfoCell from "@components/common/token-info-cell/TokenInfoCell";

interface AssetInfoProps {
  asset: Asset;
  deposit: (asset: Asset) => void;
  withdraw: (asset: Asset) => void;
  breakpoint: DEVICE_TYPE;
}
function removeTrailingZeros(value: string) {
  return value.replace(/(\.\d*?[1-9])0+$/, "$1").replace(/\.$/, "");
}

const AssetInfo: React.FC<AssetInfoProps> = ({
  asset,
  deposit,
  withdraw,
  breakpoint,
}) => {
  const { balance, type, path, price } = asset;

  const onClickItem = useCallback((path: string) => {
    location.href = `/tokens/${makeId(path)}`;
  }, []);

  const onClickDeposit = useCallback(() => {
    deposit(asset);
  }, [deposit, asset]);

  const onClickWithdraw = useCallback(() => {
    withdraw(asset);
  }, [withdraw, asset]);

  const convertBalance = useMemo(() => {
    const bigNumberBalance = BigNumber((balance ?? "").toString());

    return (
      removeTrailingZeros(
        bigNumberBalance.toFormat(bigNumberBalance.isInteger() ? 0 : 6),
      ) || 0
    );
  }, [balance]);

  const tokenInfoCell = useMemo(
    () => (
      <TokenInfoCell
        token={asset}
        breakpoint={breakpoint}
        isNative={isNativeToken(asset)}
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
        <span className="balance">{convertBalance}</span>
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
        <span className="balance">{convertBalance}</span>
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
        <span className="balance">{convertBalance}</span>
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
  <LoadButton className="withdraw-pd" onClick={onClick} disabled={disabled}>
    <IconUpload className="upload" />
    <span>Withdraw</span>
  </LoadButton>
);

export default AssetInfo;
