// TODO : remove eslint-disable after work
import { GNOT_SYMBOL, GNS_SYMBOL } from "@common/values/token-constant";
import AssetList from "@components/wallet/asset-list/AssetList";
import DepositModal from "@components/wallet/deposit-modal/DepositModal";
import WithDrawModal from "@components/wallet/withdraw-modal/WithDrawModal";
import useWithdrawTokens from "@components/wallet/withdraw-modal/useWithdrawTokens";
import useClickOutside from "@hooks/common/use-click-outside";
import { useLoading } from "@hooks/common/use-loading";
import { usePreventScroll } from "@hooks/common/use-prevent-scroll";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useTokenData } from "@hooks/token/use-token-data";
import { useWallet } from "@hooks/wallet/use-wallet";
import { TokenModel } from "@models/token/token-model";
import { useGetTokensList } from "@query/token";
import { checkGnotPath } from "@utils/common";
import { isEmptyObject } from "@utils/validation-utils";
import BigNumber from "bignumber.js";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ValuesType } from "utility-types";
import { toPriceFormat } from "@utils/number-utils";
import { useGetPositionsByAddress } from "@query/positions";

export interface AssetSortOption {
  key: ASSET_HEAD;
  direction: "asc" | "desc";
}

export const ASSET_HEAD = {
  ASSET: "Asset",
  CHAIN: "Chain",
  AMOUNT: "Amount",
  BALANCE: "Balance",
  DEPOSIT: "Deposit",
  WITHDRAW: "Withdraw",
} as const;
export type ASSET_HEAD = ValuesType<typeof ASSET_HEAD>;

export interface Asset extends TokenModel {
  balance?: number | string | null;
  price?: any;
}

export const ASSET_TYPE = {
  NATIVE: "native",
  GRC20: "grc20",
} as const;

export type ASSET_TYPE = ValuesType<typeof ASSET_TYPE>;

export const ASSET_FILTER_TYPE = {
  ALL: "All",
  GRC20: "GRC20",
} as const;

export type ASSET_FILTER_TYPE = ValuesType<typeof ASSET_FILTER_TYPE>;

function filterZeroBalance(asset: Asset) {
  const balance = BigNumber(asset?.balance ?? 0);
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
    asset.symbol.toLowerCase().includes(searchKeyword) ||
    asset.path.toLowerCase().includes(searchKeyword)
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

const handleSort = (list: SortedProps[]) => {
  const gnot = list.find(a => a.symbol === GNOT_SYMBOL);
  const gnos = list.find(a => a.symbol === GNS_SYMBOL);
  const valueOfBalance = list
    .filter(
      a =>
        a.price !== "-" && a.symbol !== GNOT_SYMBOL && a.symbol !== GNS_SYMBOL,
    )
    .sort((a, b) => {
      const priceA = parseFloat((a.price || "0").replace(/,/g, ""));
      const priceB = parseFloat((b.price || "0").replace(/,/g, ""));
      return priceB - priceA;
    });
  const amountOfBalance = list
    .filter(
      a =>
        a.price !== "-" &&
        a.symbol !== GNOT_SYMBOL &&
        a.symbol !== GNS_SYMBOL &&
        !valueOfBalance.includes(a) &&
        a.tokenPrice > 0,
    )
    .sort((a, b) => b.tokenPrice - a.tokenPrice);
  const alphabest = list
    .filter(
      a =>
        !amountOfBalance.includes(a) &&
        a.symbol !== GNOT_SYMBOL &&
        a.symbol !== GNS_SYMBOL &&
        !valueOfBalance.includes(a),
    )
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  const rs = [];
  gnot && rs.push(gnot);
  gnos && rs.push(gnos);
  return [...rs, ...valueOfBalance, ...amountOfBalance, ...alphabest];
};

const AssetListContainer: React.FC = () => {
  const { connected, account, isSwitchNetwork } = useWallet();

  const [address] = useState("");
  const [assetType, setAssetType] = useState<ASSET_FILTER_TYPE>(
    ASSET_FILTER_TYPE.ALL,
  );
  const [invisibleZeroBalance, setInvisibleZeroBalance] = useState(false);
  const [keyword, setKeyword] = useState("");
  // const [hasNext, setHasNext] = useState(false);
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
  const { data: { tokens = [] } = {} } = useGetTokensList({
    refetchInterval: 60 * 1000,
  });
  const {
    isLoading: loadingPositions,
  } = useGetPositionsByAddress(
    account?.address ?? "", {
    isClosed: false,
    queryOptions: { enabled: !!account?.address }
  });

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
        key: "Asset",
        direction: "asc",
      });
    }
  }, [tokens]);

  const filteredTokens = useMemo(() => {
    const COLLAPSED_LENGTH = 15;
    const temp: SortedProps[] = tokens
      .map(item => {
        const tokenPrice = balances[item.priceID];
        if (!tokenPrice || tokenPrice === null || Number.isNaN(tokenPrice)) {
          return {
            price: "-",
            balance: "0",
            ...item,
            tokenPrice: tokenPrice || 0,
            sortPrice: "0",
          };
        }
        const price = BigNumber(tokenPrice)
          .multipliedBy(tokenPrices[checkGnotPath(item?.path)]?.usd || "0")
          .dividedBy(10 ** 6);
        const checkPrice = price.isGreaterThan(0) && price.isLessThan(0.01);
        return {
          ...item,
          price: isSwitchNetwork
            ? "-"
            : checkPrice
              ? "<$0.01"
              : toPriceFormat(price, { isFormat: false }),
          balance: isSwitchNetwork
            ? "0"
            : BigNumber(displayBalanceMap[item.path] ?? 0).toString(),
          tokenPrice: tokenPrice || 0,
          sortPrice: price.toString(),
        };
      })
      .filter(
        asset => invisibleZeroBalance === false || filterZeroBalance(asset),
      );

    let sortedData = handleSort(temp || []);

    if (sortOption?.key === "Asset") {
      sortedData = sortedData.sort((x, y) => {
        return sortOption?.direction === "asc"
          ? x.name.localeCompare(y.name)
          : y.name.localeCompare(x.name);
      });
    }
    if (sortOption?.key === "Chain") {
      sortedData = sortedData.sort((x, y) => {
        return sortOption?.direction === "asc"
          ? x.type.localeCompare(y.type)
          : y.type.localeCompare(x.type);
      });
    }

    if (sortOption?.key === "Amount") {
      sortedData = sortedData.sort((x, y) => {
        return sortOption?.direction === "desc"
          ? Number(y.balance) - Number(x.balance)
          : Number(x.balance) - Number(y.balance);
      });
    }

    if (sortOption?.key === "Balance") {
      sortedData = sortedData.sort((x, y) => {
        if (
          x.sortPrice === undefined ||
          y.sortPrice === undefined ||
          x.sortPrice === null ||
          y.sortPrice === null
        )
          return 0;

        return sortOption?.direction === "desc"
          ? Number(y.sortPrice) - Number(x.sortPrice)
          : Number(x.sortPrice) - Number(y.sortPrice);
      });
    }

    sortedData = sortedData
      .filter((asset: any) => filterType(asset, assetType))
      .filter((asset: any) => filterKeyword(asset, keyword));

    const resultFilteredAssets = extended
      ? sortedData
      : sortedData.slice(0, Math.min(sortedData.length, COLLAPSED_LENGTH));

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
    const disableItems = ["Deposit", "Withdraw"];
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
  } = useWithdrawTokens();

  const onSubmit = (amount: any, address: string) => {
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
        assets={filteredTokens}
        isFetched={
          isFetched &&
          !isLoadingTokens &&
          !loadingPositions &&
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
        isSortOption={isSortOption}
        breakpoint={breakpoint}
        searchIcon={searchIcon}
        onTogleSearch={onTogleSearch}
        searchRef={componentRef}
      />
      {isShowDepositModal && (
        <DepositModal
          breakpoint={breakpoint}
          close={closeDeposit}
          depositInfo={depositInfo}
          changeToken={changeTokenDeposit}
          callback={callbackDeposit}
        />
      )}
      {isShowWithdrawModal && (
        <WithDrawModal
          breakpoint={breakpoint}
          close={closeWithdraw}
          withdrawInfo={withdrawInfo}
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
