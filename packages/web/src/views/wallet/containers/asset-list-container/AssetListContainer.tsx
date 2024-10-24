import BigNumber from "bignumber.js";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ValuesType } from "utility-types";

import {
  GNOT_TOKEN,
  GNOT_TOKEN_DEFAULT,
  GNS_TOKEN,
  WUGNOT_TOKEN,
} from "@common/values/token-constant";
import AssetReceiveModal from "@components/wallet/asset-receive-modal/AssetReceiveModal";
import useClickOutside from "@hooks/common/use-click-outside";
import useCustomRouter from "@hooks/common/use-custom-router";
import { useLoading } from "@hooks/common/use-loading";
import { usePositionData } from "@hooks/common/use-position-data";
import { usePreventScroll } from "@hooks/common/use-prevent-scroll";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useTokenData } from "@hooks/token/use-token-data";
import { useWallet } from "@hooks/wallet/use-wallet";
import { TokenModel } from "@models/token/token-model";
import { useGetAvgBlockTime } from "@query/address";
import { useGetTokens } from "@query/token";
import { checkGnotPath } from "@utils/common";
import { formatPoolPairAmount, formatPrice } from "@utils/new-number-utils";
import { isEmptyObject } from "@utils/validation-utils";

import { ASSET_FILTER_TYPE } from "../../components/asset-list/asset-list-header/AssetListHeader";
import {
  AssetSortOption,
  ASSET_HEAD,
  type Asset,
} from "../../components/asset-list/asset-list-table/AssetListTable";
import AssetList from "../../components/asset-list/AssetList";
import AssetSendModal from "../../components/asset-send-modal/AssetSendModal";
import useSendAsset from "../../hooks/useSendAsset";

export const ASSET_TYPE = {
  NATIVE: "native",
  GRC20: "grc20",
} as const;

export type ASSET_TYPE = ValuesType<typeof ASSET_TYPE>;

function filterZeroBalance(asset: Asset) {
  if (asset?.balance === "-") return false;

  const balance = BigNumber(asset?.balance?.toString().replace(/,/g, "") ?? 0);
  return balance.isGreaterThan(0);
}

function filterType(asset: Asset, type: ASSET_FILTER_TYPE) {
  if (type === "All") return true;
  return asset.type.toUpperCase() === type.toUpperCase();
}

function filterKeyword(asset: Asset, keyword: string) {
  const searchKeyword = keyword.trim().toLowerCase();
  if (searchKeyword === "") return true;
  return (
    asset.name.toLowerCase().includes(searchKeyword) ||
    asset.symbol.toLowerCase().includes(searchKeyword)
  );
}

const DEPOSIT_INFO: TokenModel = {
  chainId: "dev",
  createdAt: "2023-10-10T08:48:46+09:00",
  name: "ATOM",
  address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
  path: "gno.land/r/gns",
  decimals: 4,
  symbol: "ATOM",
  logoURI: "/atom.svg",
  type: "grc20",
  priceID: "gno.land/r/gns",
};

interface SortedProps extends TokenModel {
  balance: string;
  price?: string;
  tokenPrice: number;
  sortPrice?: string;
}

const AssetListContainer: React.FC = () => {
  const router = useCustomRouter();
  const { connected, account, isSwitchNetwork } = useWallet();

  const [address] = useState("");
  const [assetType, setAssetType] = useState<ASSET_FILTER_TYPE>(
    ASSET_FILTER_TYPE.ALL,
  );
  const [invisibleZeroBalance, setInvisibleZeroBalance] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [extended, setExtened] = useState(true);
  const [hasLoader] = useState(false);
  const [sortOption, setTokenSortOption] = useState<AssetSortOption>();
  const { breakpoint } = useWindowSize();
  const [searchIcon, setSearchIcon] = useState(false);
  const [componentRef, isClickOutside, setIsInside] = useClickOutside();
  const [isShowDepositModal, setIsShowDepositModal] = useState(false);
  const [isShowWithdrawModal, setIsShowWithDrawModal] = useState(false);
  const [depositInfo, setDepositInfo] = useState<TokenModel>(DEPOSIT_INFO);
  const [withdrawInfo, setWithDrawInfo] = useState<TokenModel>(DEPOSIT_INFO);
  const { isLoadingTokens } = useLoading();
  const { data: blockTimeData } = useGetAvgBlockTime();
  const { data: { tokens = [] } = {} } = useGetTokens();
  const { loading: loadingPositions } = usePositionData({
    isClosed: false,
  });

  const isLoadingPosition = useMemo(
    () => connected && loadingPositions,
    [connected, loadingPositions],
  );

  const changeTokenDeposit = useCallback((token: TokenModel) => {
    setDepositInfo(token);
    setIsShowDepositModal(true);
  }, []);

  const changeTokenWithdraw = useCallback((token: TokenModel) => {
    setWithDrawInfo(token);
    setIsShowWithDrawModal(true);
  }, []);

  const onTogleSearch = () => {
    setSearchIcon(prev => !prev);
    setIsInside(true);
  };

  useEffect(() => {
    if (!keyword) {
      if (isClickOutside) {
        setSearchIcon(false);
      }
    }
  }, [isClickOutside, keyword]);

  const {
    displayBalanceMap,
    balances,
    tokenPrices,
    isFetched,
    updateBalances,
  } = useTokenData();

  useEffect(() => {
    const interval = setInterval(() => {
      updateBalances();
    }, 60000);
    return () => clearInterval(interval);
  }, [tokens]);

  useEffect(() => {
    if (!tokens) return;

    if (tokens?.length === 0) {
      setTokenSortOption({
        key: ASSET_HEAD.BALANCE,
        direction: "desc",
      });
    }
  }, [tokens]);

  const fixedTokens: SortedProps[] = useMemo(() => {
    let gnot = GNOT_TOKEN_DEFAULT as TokenModel;
    let wugnot = WUGNOT_TOKEN as TokenModel;
    let gns = GNS_TOKEN as TokenModel;
    let foundCount = 0;

    for (let index = 0; index < tokens.length; index++) {
      if (foundCount === 3) {
        break;
      }

      if (tokens[index].path === GNOT_TOKEN.path) {
        foundCount++;
        gnot = tokens[index];
      }
      if (tokens[index].path === GNS_TOKEN.path) {
        foundCount++;
        gns = tokens[index];
      }
      if (tokens[index].path === WUGNOT_TOKEN.path) {
        foundCount++;
        wugnot = tokens[index];
      }
    }

    return [gnot, wugnot, gns]
      .map(item => {
        const tokenPrice = balances[item.priceID];
        if (!tokenPrice || tokenPrice === null || Number.isNaN(tokenPrice)) {
          return {
            price: "-",
            balance: "-",
            ...item,
            tokenPrice: tokenPrice || 0,
            sortPrice: "-",
          };
        }

        const price = (() => {
          if (
            isSwitchNetwork ||
            !tokenPrices[checkGnotPath(item?.path)]?.usd ||
            !balances[item.priceID]
          )
            return "-";

          return formatPrice(
            BigNumber(tokenPrice)
              .multipliedBy(tokenPrices[checkGnotPath(item?.path)]?.usd || 0)
              .dividedBy(10 ** (item.decimals || 0)),
            {
              isKMB: false,
            },
          );
        })();

        const balance = (() => {
          if (isSwitchNetwork || !displayBalanceMap[item.path]) return "-";

          return formatPoolPairAmount(displayBalanceMap[item.path], {
            isKMB: false,
            decimals: item.decimals,
          });
        })();

        return {
          ...item,
          price,
          balance,
          tokenPrice: tokenPrice || 0,
          sortPrice: price.toString(),
        };
      })
      .filter(
        asset => invisibleZeroBalance === false || filterZeroBalance(asset),
      )
      .filter(asset => filterKeyword(asset, keyword))
      .filter(asset => filterType(asset, assetType));
  }, [
    balances,
    displayBalanceMap,
    invisibleZeroBalance,
    isSwitchNetwork,
    tokenPrices,
    tokens,
    keyword,
    assetType,
  ]);

  const filteredTokens = useMemo(() => {
    const COLLAPSED_LENGTH = 15;
    let mappedTokens: SortedProps[] = tokens
      .filter(
        item =>
          item.path !== GNOT_TOKEN.path &&
          item.path !== GNS_TOKEN.path &&
          item.path !== WUGNOT_TOKEN.path,
      )
      .map(item => {
        const tokenPrice = balances[item.priceID];
        if (!tokenPrice || Number.isNaN(tokenPrice)) {
          return {
            price: "-",
            balance: "-",
            ...item,
            tokenPrice: tokenPrice || 0,
            sortPrice: "-",
          };
        }

        const price = (() => {
          if (
            isSwitchNetwork ||
            !tokenPrices[checkGnotPath(item?.path)]?.usd ||
            !balances[item.priceID]
          )
            return "-";

          return formatPrice(
            BigNumber(tokenPrice)
              .multipliedBy(tokenPrices[checkGnotPath(item?.path)]?.usd || 0)
              .dividedBy(10 ** (item.decimals || 0)),
            {
              isKMB: false,
            },
          );
        })();

        const balance = (() => {
          if (isSwitchNetwork || !displayBalanceMap[item.path]) return "-";

          return formatPoolPairAmount(displayBalanceMap[item.path], {
            isKMB: false,
            decimals: item.decimals,
          });
        })();
        return {
          ...item,
          price: price,
          balance: balance,
          tokenPrice: tokenPrice || 0,
          sortPrice: price.toString(),
        };
      })
      .filter(
        asset => invisibleZeroBalance === false || filterZeroBalance(asset),
      );

    if (sortOption?.key === ASSET_HEAD.ASSET) {
      mappedTokens = mappedTokens.sort((x, y) => {
        return sortOption?.direction === "asc"
          ? x.name.localeCompare(y.name)
          : y.name.localeCompare(x.name);
      });
    }
    if (sortOption?.key === ASSET_HEAD.CHAIN) {
      mappedTokens = mappedTokens.sort((x, y) => {
        return sortOption?.direction === "asc"
          ? x.type.localeCompare(y.type)
          : y.type.localeCompare(x.type);
      });
    }

    if (sortOption?.key === ASSET_HEAD.AMOUNT) {
      mappedTokens = mappedTokens.sort((x, y) => {
        const xBalance = x.balance === "-" ? "-1" : x.balance;
        const yBalance = y.balance === "-" ? "-1" : y.balance;

        return sortOption?.direction === "desc"
          ? Number(yBalance.replace(/,/g, "")) -
              Number(xBalance.replace(/,/g, ""))
          : Number(xBalance.replace(/,/g, "")) -
              Number(yBalance.replace(/,/g, ""));
      });
    }

    if (sortOption?.key === ASSET_HEAD.BALANCE) {
      mappedTokens = mappedTokens.sort((x, y) => {
        if (
          x.sortPrice === undefined ||
          y.sortPrice === undefined ||
          x.sortPrice === null ||
          y.sortPrice === null
        ) {
          return 0;
        }

        const xPrice =
          x.sortPrice === "-"
            ? "-1"
            : x.sortPrice.replace("$", "").replace(/,/g, "");
        const yPrice =
          y.sortPrice === "-"
            ? "-1"
            : y.sortPrice.replace("$", "").replace(/,/g, "");

        return sortOption?.direction === "desc"
          ? Number(yPrice) - Number(xPrice)
          : Number(xPrice) - Number(yPrice);
      });
    }

    mappedTokens = mappedTokens
      .filter(asset => filterType(asset, assetType))
      .filter(asset => filterKeyword(asset, keyword));

    const resultFilteredAssets = extended
      ? mappedTokens
      : mappedTokens.slice(0, Math.min(mappedTokens.length, COLLAPSED_LENGTH));

    return resultFilteredAssets;
  }, [
    tokens,
    sortOption?.key,
    sortOption?.direction,
    extended,
    balances,
    tokenPrices,
    displayBalanceMap,
    invisibleZeroBalance,
    assetType,
    keyword,
    isSwitchNetwork,
  ]);
  const changeAssetType = useCallback((newType: string) => {
    switch (newType) {
      case ASSET_FILTER_TYPE.ALL:
        setAssetType(ASSET_FILTER_TYPE.ALL);
        break;
      case ASSET_FILTER_TYPE.GRC20:
        setAssetType(ASSET_FILTER_TYPE.GRC20);
        break;
      default:
        setAssetType(ASSET_FILTER_TYPE.ALL);
    }
  }, []);

  const toggleInvisibleZeroBalance = useCallback(() => {
    setInvisibleZeroBalance(!invisibleZeroBalance);
  }, [invisibleZeroBalance]);

  const toggleExtended = useCallback(() => {
    setExtened(!extended);
  }, [extended]);

  const search = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  }, []);

  const deposit = useCallback(
    (asset: Asset) => {
      if (!connected) return;
      setIsShowDepositModal(true);
      setDepositInfo(asset);
      if (!address) return;
    },
    [address, connected],
  );

  const withdraw = useCallback(
    (asset: Asset) => {
      if (!connected) return;
      setIsShowWithDrawModal(true);
      setWithDrawInfo(asset);
      if (!address) return;
    },
    [address, connected],
  );

  const sort = useCallback(
    (item: ASSET_HEAD) => {
      const key = item;
      const direction =
        sortOption?.key !== item
          ? "desc"
          : sortOption.direction === "asc"
          ? "desc"
          : "asc";

      setTokenSortOption({
        key,
        direction,
      });
    },
    [sortOption],
  );

  const isSortOption = useCallback((head: ASSET_HEAD) => {
    const disableItems: ASSET_HEAD[] = [ASSET_HEAD.SEND, ASSET_HEAD.RECEIVE];
    return !disableItems.includes(head);
  }, []);

  const closeDeposit = () => {
    setIsShowDepositModal(false);
  };

  const closeWithdraw = () => {
    setIsShowWithDrawModal(false);
  };

  const callbackDeposit = (value: boolean) => {
    setIsShowDepositModal(value);
  };

  const callbackWithdraw = (value: boolean) => {
    setIsShowWithDrawModal(value);
  };

  usePreventScroll(isShowDepositModal || isShowWithdrawModal);

  const {
    isConfirm,
    setIsConfirm,
    onSubmit: handleSubmit,
  } = useSendAsset();

  const moveTokenPage = useCallback((tokenPath: string) => {
    router.movePageWithTokenPath("TOKEN", tokenPath);
  }, []);

  const onSubmit = (amount: string, address: string) => {
    if (!withdrawInfo || !account?.address) return;
    handleSubmit(
      {
        fromAddress: account.address,
        toAddress: address,
        token: withdrawInfo,
        tokenAmount: BigNumber(amount).multipliedBy(1000000).toNumber(),
      },
      withdrawInfo.type,
    );
    closeWithdraw();
  };

  return (
    <>
      <AssetList
        assets={[...fixedTokens, ...filteredTokens]}
        isFetched={
          isFetched &&
          !isLoadingTokens &&
          !isLoadingPosition &&
          !(isEmptyObject(balances) && account?.address)
        }
        assetType={assetType}
        invisibleZeroBalance={invisibleZeroBalance}
        keyword={keyword}
        extended={extended}
        hasLoader={hasLoader}
        changeAssetType={changeAssetType}
        search={search}
        toggleInvisibleZeroBalance={toggleInvisibleZeroBalance}
        toggleExtended={toggleExtended}
        deposit={deposit}
        withdraw={withdraw}
        sortOption={sortOption}
        sort={sort}
        moveTokenPage={moveTokenPage}
        isSortOption={isSortOption}
        breakpoint={breakpoint}
        searchIcon={searchIcon}
        onTogleSearch={onTogleSearch}
        searchRef={componentRef}
      />
      {isShowDepositModal && (
        <AssetReceiveModal
          breakpoint={breakpoint}
          close={closeDeposit}
          depositInfo={depositInfo}
          avgBlockTime={blockTimeData?.AvgBlockTime || 2.2}
          changeToken={changeTokenDeposit}
          callback={callbackDeposit}
        />
      )}
      {isShowWithdrawModal && (
        <AssetSendModal
          breakpoint={breakpoint}
          close={closeWithdraw}
          withdrawInfo={withdrawInfo}
          avgBlockTime={blockTimeData?.AvgBlockTime || 2.2}
          connected={connected}
          changeToken={changeTokenWithdraw}
          callback={callbackWithdraw}
          setIsConfirm={() => setIsConfirm(true)}
          isConfirm={isConfirm}
          handleSubmit={onSubmit}
        />
      )}
    </>
  );
};

export default AssetListContainer;
