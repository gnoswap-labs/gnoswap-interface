import { useCallback, useMemo } from "react";

import TokenInfoCell from "@components/common/token-info-cell/TokenInfoCell";
import { AssetReceiveButton } from "@components/wallet/asset-button/AssetReceiveButton";
import { AssetSendButton } from "@components/wallet/asset-button/AssetSendButton";
import { ASSET_INFO, ASSET_INFO_MOBILE, ASSET_INFO_TABLET } from "@constants/skeleton.constant";
import { isNativeToken } from "@models/token/token-model";
import { DEVICE_TYPE } from "@styles/media";
import { GNOT_TOKEN } from "@common/values/token-constant";
import { QUERY_PARAMETER } from "@constants/page.constant";
import { usePrefetchNavigation } from "@hooks/common/use-prefetch-navigation";

import { Asset } from "../AssetListTable";

import { AssetInfoWrapper, TableColumn } from "./AssetInfo.styles";

export interface AssetInfoProps {
  asset: Asset;
  deposit: (asset: Asset) => void;
  withdraw: (asset: Asset) => void;
  moveTokenPage: (tokenPath: string) => void;
  breakpoint: DEVICE_TYPE;
}

const AssetInfo: React.FC<AssetInfoProps> = ({ asset, deposit, withdraw, moveTokenPage, breakpoint }) => {
  const { balance, type, path, price } = asset;

  const { prefetch } = usePrefetchNavigation({
    pageType: "TOKEN",
    params: {
      [QUERY_PARAMETER.TOKEN_PATH]: path,
    },
  });

  const handleClickItem = useCallback(() => {
    moveTokenPage(path);
  }, [moveTokenPage, path]);

  const handleMouseEnter = useCallback(() => {
    prefetch();
  }, [prefetch]);

  const onClickDeposit = useCallback(() => {
    deposit(asset);
  }, [deposit, asset]);

  const onClickWithdraw = useCallback(() => {
    withdraw(asset);
  }, [withdraw, asset]);

  const tokenInfoCell = useMemo(
    () => <TokenInfoCell token={asset} isNative={isNativeToken(asset)} breakpoint={breakpoint} truncateName />,
    [asset, breakpoint],
  );

  const displayTokenChain = useMemo(() => {
    return `${GNOT_TOKEN.name} (${type})`;
  }, [type]);

  return breakpoint === DEVICE_TYPE.WEB ? (
    <AssetInfoWrapper>
      <TableColumn
        id={asset.symbol}
        className="name-col left pointer"
        tdWidth={ASSET_INFO.list?.[0].width}
        onClick={handleClickItem}
        onMouseEnter={handleMouseEnter}
      >
        {tokenInfoCell}
      </TableColumn>
      <TableColumn className="left" tdWidth={ASSET_INFO.list?.[1].width}>
        <span className="chain">{displayTokenChain}</span>
      </TableColumn>
      <TableColumn className="left" tdWidth={ASSET_INFO.list?.[2].width}>
        <span className="balance">{balance}</span>
      </TableColumn>
      <TableColumn className="left" tdWidth={ASSET_INFO.list?.[3].width}>
        <span className="balance">{price}</span>
      </TableColumn>
      <TableColumn tdWidth={ASSET_INFO.list?.[4].width}>
        <AssetReceiveButton onClick={onClickDeposit} />
      </TableColumn>
      <TableColumn tdWidth={ASSET_INFO.list?.[5].width}>
        <AssetSendButton onClick={onClickWithdraw} />
      </TableColumn>
    </AssetInfoWrapper>
  ) : breakpoint !== DEVICE_TYPE.MOBILE ? (
    <AssetInfoWrapper>
      <TableColumn
        className="name-col left"
        tdWidth={ASSET_INFO_TABLET.list[0].width}
        onClick={handleClickItem}
        onMouseEnter={handleMouseEnter}
      >
        {tokenInfoCell}
      </TableColumn>
      <TableColumn className="left" tdWidth={ASSET_INFO_TABLET.list[1].width}>
        <span className="chain">{displayTokenChain}</span>
      </TableColumn>
      <TableColumn className="left" tdWidth={ASSET_INFO_TABLET.list[2].width}>
        <span className="balance">{balance}</span>
      </TableColumn>
      <TableColumn className="left" tdWidth={ASSET_INFO_TABLET.list[3].width}>
        <span className="balance">{price}</span>
      </TableColumn>
      <TableColumn tdWidth={ASSET_INFO_TABLET.list[4].width}>
        <AssetReceiveButton onClick={onClickDeposit} />
      </TableColumn>
      <TableColumn tdWidth={ASSET_INFO_TABLET.list[5].width}>
        <AssetSendButton onClick={onClickWithdraw} />
      </TableColumn>
    </AssetInfoWrapper>
  ) : (
    <AssetInfoWrapper>
      <TableColumn
        className="name-col left"
        tdWidth={ASSET_INFO_MOBILE.list[0].width}
        onClick={handleClickItem}
        onMouseEnter={handleMouseEnter}
      >
        {tokenInfoCell}
      </TableColumn>
      <TableColumn className="left" tdWidth={ASSET_INFO_MOBILE.list[1].width}>
        <span className="chain">{displayTokenChain}</span>
      </TableColumn>
      <TableColumn className="left" tdWidth={ASSET_INFO_MOBILE.list[2].width}>
        <span className="balance">{balance}</span>
      </TableColumn>
      <TableColumn className="left" tdWidth={ASSET_INFO_MOBILE.list[3].width}>
        <span className="balance">{price}</span>
      </TableColumn>
      <TableColumn tdWidth={ASSET_INFO_MOBILE.list[4].width}>
        <AssetReceiveButton onClick={onClickDeposit} />
      </TableColumn>
      <TableColumn tdWidth={ASSET_INFO_MOBILE.list[5].width}>
        <AssetSendButton onClick={onClickWithdraw} />
      </TableColumn>
    </AssetInfoWrapper>
  );
};

export default AssetInfo;
