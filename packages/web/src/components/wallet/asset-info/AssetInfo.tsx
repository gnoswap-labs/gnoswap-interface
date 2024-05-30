import { useCallback, useMemo } from "react";
import IconDownload from "@components/common/icons/IconDownload";
import IconUpload from "@components/common/icons/IconUpload";
import { Asset } from "@containers/asset-list-container/AssetListContainer";
import { AssetInfoWrapper, LoadButton, TableColumn } from "./AssetInfo.styles";
import {
  ASSET_TD_WIDTH,
  MOBILE_ASSET_TD_WIDTH,
  TABLET_ASSET_TD_WIDTH,
} from "@constants/skeleton.constant";
import { DEVICE_TYPE } from "@styles/media";
import BigNumber from "bignumber.js";
import { makeId } from "@utils/common";
import IconOpenLink from "@components/common/icons/IconOpenLink";
import { useTheme } from "@emotion/react";
import { isNativeToken } from "@models/token/token-model";
import MissingLogo from "@components/common/missing-logo/MissingLogo";

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
  const theme = useTheme();
  const { logoURI, name, symbol, balance, type, path, price } = asset;
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

    return removeTrailingZeros(bigNumberBalance.toFormat(bigNumberBalance.isInteger() ? 0 : 6)) || 0;
  }, [balance]);

  const priceData = ["-", "<$0.01"].includes(price) ? price : `$${price}`;

  const tokenPathDisplay = useMemo(() => {
    const path_ = path;

    if (isNativeToken(asset)) return "Native coin";

    const tokenPathArr = path_?.split("/") ?? [];

    if (tokenPathArr?.length <= 0) return path_;

    const lastPath = tokenPathArr[tokenPathArr?.length - 1];

    if (lastPath.length >= 12) {
      return "..." + tokenPathArr[tokenPathArr?.length - 1].slice(length - 12, length - 1);
    }

    return path_.replace("gno.land", "...");
  }, [asset, path]);


  const onClickPath = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>, path: string) => {
    e.stopPropagation();
    if (path === "gnot") {
      window.open("https://gnoscan.io/", "_blank");
    } else {
      window.open("https://gnoscan.io/tokens/" + encodeURIComponent(path), "_blank");
    }
  }, []);

  return breakpoint === DEVICE_TYPE.WEB ? (
    <AssetInfoWrapper>
      <TableColumn
        className="name-col left-padding left pointer "
        tdWidth={ASSET_TD_WIDTH[0]}
        onClick={() => onClickItem(path)}
      >
        <MissingLogo
          symbol={symbol}
          url={logoURI}
          className="logo"
          width={28}
          mobileWidth={28}
        />
        <div className="token-name-symbol-path">
          <div className="token-name-path">
            <strong className="token-name">{name}</strong>
            <div className="token-path" onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => onClickPath(e, path)}>
              <div>{tokenPathDisplay}</div>
              <IconOpenLink
                viewBox="0 0 22 22"
                fill={theme.color.text04}
                className="path-link-icon" />
            </div>
          </div>
          <span className="token-symbol">{symbol}</span>
        </div>
      </TableColumn>
      <TableColumn className="left" tdWidth={ASSET_TD_WIDTH[1]}>
        <span className="chain">
          {type === "grc20" ? "Gnoland (GRC20)" : "Gnoland (Native)"}
        </span>
      </TableColumn>
      <TableColumn className="left" tdWidth={ASSET_TD_WIDTH[2]}>
        <span className="balance">{convertBalance}</span>
      </TableColumn>
      <TableColumn className="left" tdWidth={ASSET_TD_WIDTH[3]}>
        <span className="balance">{priceData}</span>
      </TableColumn>
      <TableColumn tdWidth={ASSET_TD_WIDTH[4]}>
        <DepositButton onClick={onClickDeposit} />
      </TableColumn>
      <TableColumn tdWidth={ASSET_TD_WIDTH[5]}>
        <WithdrawButton onClick={onClickWithdraw} />
      </TableColumn>
    </AssetInfoWrapper>
  ) : breakpoint !== DEVICE_TYPE.MOBILE ? (
    <AssetInfoWrapper>
      <TableColumn
        className="name-col left-padding left"
        tdWidth={TABLET_ASSET_TD_WIDTH[0]}
        onClick={() => onClickItem(symbol)}
      >
        <MissingLogo
          symbol={symbol}
          url={logoURI}
          className="logo"
          width={28}
          mobileWidth={28}
        />
        <div className="token-name-symbol-path">
          <div className="token-name-path">
            <strong className="token-name">{name}</strong>
            <div className="token-path" onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => onClickPath(e, path)}>
              <div>{tokenPathDisplay}</div>
              <IconOpenLink
                viewBox="0 0 22 22"
                fill={theme.color.text04}
                className="path-link-icon" />
            </div>
          </div>
          <span className="token-symbol">{symbol}</span>
        </div>
      </TableColumn>
      <TableColumn className="left" tdWidth={TABLET_ASSET_TD_WIDTH[1]}>
        <span className="chain">
          {type === "grc20" ? "Gnoland (GRC20)" : "Gnoland (Native)"}
        </span>
      </TableColumn>
      <TableColumn className="left" tdWidth={TABLET_ASSET_TD_WIDTH[2]}>
        <span className="balance">{convertBalance}</span>
      </TableColumn>
      <TableColumn className="left" tdWidth={TABLET_ASSET_TD_WIDTH[3]}>
        <span className="balance">{priceData}</span>
      </TableColumn>
      <TableColumn tdWidth={TABLET_ASSET_TD_WIDTH[4]}>
        <DepositButton onClick={onClickDeposit} />
      </TableColumn>
      <TableColumn tdWidth={TABLET_ASSET_TD_WIDTH[5]}>
        <WithdrawButton onClick={onClickWithdraw} />
      </TableColumn>
    </AssetInfoWrapper>
  ) : (
    <AssetInfoWrapper>
      <TableColumn
        className="name-col left-padding left"
        tdWidth={MOBILE_ASSET_TD_WIDTH[0]}
        onClick={() => onClickItem(symbol)}
      >
        <MissingLogo
          symbol={symbol}
          url={logoURI}
          className="logo"
          width={28}
          mobileWidth={28}
        />
        <div className="token-name-symbol-path">
          <div className="token-name-path">
            <strong className="token-name">{name}</strong>
            <div className="token-path" onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => onClickPath(e, path)}>
              <div>{tokenPathDisplay}</div>
              <IconOpenLink
                viewBox="0 0 22 22"
                fill={theme.color.text04}
                className="path-link-icon" />
            </div>
          </div>
          <span className="token-symbol">{symbol}</span>
        </div>
      </TableColumn>
      <TableColumn className="left" tdWidth={MOBILE_ASSET_TD_WIDTH[1]}>
        <span className="chain">
          {type === "grc20" ? "Gnoland (GRC20)" : "Gnoland (Native)"}
        </span>
      </TableColumn>
      <TableColumn className="left" tdWidth={MOBILE_ASSET_TD_WIDTH[2]}>
        <span className="balance">{convertBalance}</span>
      </TableColumn>
      <TableColumn className="left" tdWidth={MOBILE_ASSET_TD_WIDTH[3]}>
        <span className="balance">{priceData}</span>
      </TableColumn>
      <TableColumn tdWidth={MOBILE_ASSET_TD_WIDTH[4]}>
        <DepositButton onClick={onClickDeposit} />
      </TableColumn>
      <TableColumn tdWidth={MOBILE_ASSET_TD_WIDTH[5]}>
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
