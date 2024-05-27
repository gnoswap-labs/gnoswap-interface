import TrendingCardList from "@components/home/trending-card-list/TrendingCardList";
import { useLoading } from "@hooks/common/use-loading";
import { useWindowSize } from "@hooks/common/use-window-size";
import { usePoolData } from "@hooks/pool/use-pool-data";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { UpDownType } from "@models/common/card-list-item-info";
import { TokenModel } from "@models/token/token-model";
import { useGetChainList, useGetTokensList } from "@query/token";
import { ITrending } from "@repositories/token";
import { makeId } from "@utils/common";
import { toPriceFormat } from "@utils/number-utils";
import { useRouter } from "next/router";
import React, { useCallback, useMemo } from "react";

const defaultToken = {
  path: "",
  type: "grc20",
  address: "",
  chainId: "",
  name: "",
  symbol: "",
  decimals: 0,
  logoURI: "",
  createdAt: "",
  isWrappedGasToken: false,
  isGasToken: false,
  description: "",
  websiteURL: "",
  wrappedPath: "",
  denom: "",
  priceID: ""
};

const TrendingCardListContainer: React.FC = () => {
  const router = useRouter();
  const { breakpoint } = useWindowSize();
  const { data: { tokens = [] } = {}, isLoading: isLoadingListToken } =
    useGetTokensList();
  const { data: { trending = [] } = {}, isLoading } = useGetChainList();
  const { loading: isLoadingPoolData } = usePoolData();
  const { isLoadingCommon } = useLoading();
  const { gnot, wugnotPath } = useGnotToGnot();

  const moveTokenDetails = useCallback((path: string) => {
    router.push("/tokens/" + makeId(path));
  }, [router]);

  const onClickItem = useCallback((path: string) => {
    moveTokenDetails(path);
  }, [moveTokenDetails]);

  const trendingCryptoList = useMemo(() => {
    return (trending ?? [])
      ?.map((item: ITrending) => {
        const tempToken = tokens.find(
          (token: TokenModel) => token.path === item.tokenPath,
        ) as TokenModel ?? defaultToken;
        const priceChange = item.tokenPrice24hChange || 0;
        const status = (() => {
          if (priceChange === "" || Number(priceChange) >= 0) return "up";

          return "down";
        })();
        return {
          token: {
            ...tempToken,
            path:
              item.tokenPath === wugnotPath ? gnot?.path || "" : item.tokenPath || "",
            name: item.tokenPath === wugnotPath ? gnot?.name || "" : tempToken?.name || "",
            symbol:
              item.tokenPath === wugnotPath ? gnot?.symbol || "" : tempToken?.symbol || "",
            logoURI:
              item.tokenPath === wugnotPath ? gnot?.logoURI || "" : tempToken?.logoURI || "",
          },
          price: `${(toPriceFormat(item.tokenPrice, { usd: true }))}`,
          upDown: status as UpDownType,
          content: `${Number(priceChange).toFixed(2)}%`
        };
      })
      .slice(0, 3);
  }, [tokens, trending, gnot, wugnotPath]);

  return (
    <TrendingCardList
      list={trendingCryptoList}
      device={breakpoint}
      onClickItem={onClickItem}
      loading={isLoading || isLoadingPoolData || isLoadingCommon || isLoadingListToken}
    />
  );
};

export default TrendingCardListContainer;
