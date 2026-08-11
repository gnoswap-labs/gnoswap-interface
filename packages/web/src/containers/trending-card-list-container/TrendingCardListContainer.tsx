import TrendingCardList from "@components/home/trending-card-list/TrendingCardList";
import useCustomRouter from "@hooks/common/use-custom-router";
import { useLoading } from "@hooks/common/use-loading";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useGnotToGnot } from "@hooks/token/data/use-gnot-wugnot";
import { UpDownType } from "@models/common/card-list-item-info";
import { TokenModel } from "@models/token/token-model";
import { useGetChainInfo, useGetTokens } from "@query/token";
import { ITrending } from "@repositories/token";
import { formatPrice, formatRate } from "@utils/new-number-utils";
import React, { useCallback, useMemo } from "react";

const defaultToken = {
  path: "",
  type: "GRC20",
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
  priceID: "",
};

const TrendingCardListContainer: React.FC = () => {
  const router = useCustomRouter();
  const { breakpoint } = useWindowSize();
  const { data: { tokens = [] } = {} } = useGetTokens(true);
  const { data: { trending = [] } = {} } = useGetChainInfo();
  const { gnot, wugnotPath } = useGnotToGnot();
  const { isLoadingTrendingTokens } = useLoading();

  const moveTokenDetails = useCallback(
    (path: string) => {
      router.movePageWithTokenPath("TOKEN", path);
    },
    [router],
  );

  const onClickItem = useCallback(
    (path: string) => {
      moveTokenDetails(path);
    },
    [moveTokenDetails],
  );

  const trendingCryptoList = useMemo(() => {
    return (trending ?? [])
      ?.map((item: ITrending) => {
        const tempToken =
          (tokens.find((token: TokenModel) => token.path === item.tokenPath) as TokenModel) ?? defaultToken;
        const priceChange = item.tokenPrice24hChange || 0;
        const status = (() => {
          if (priceChange === "" || Number(priceChange) >= 0) return "up";

          return "down";
        })();
        return {
          token: {
            ...tempToken,
            path: item.tokenPath === wugnotPath ? gnot?.path || "" : item.tokenPath || "",
            name: item.tokenPath === wugnotPath ? gnot?.name || "" : tempToken?.name || "",
            symbol: item.tokenPath === wugnotPath ? gnot?.symbol || "" : tempToken?.symbol || "",
            logoURI: item.tokenPath === wugnotPath ? gnot?.logoURI || "" : tempToken?.logoURI || "",
          },
          price: formatPrice(item.tokenPrice),
          upDown: status as UpDownType,
          content: formatRate(Math.abs(Number(priceChange)), {
            allowZeroDecimals: true,
          }),
        };
      })
      .slice(0, 3);
  }, [tokens, trending, gnot, wugnotPath]);

  return (
    <TrendingCardList
      list={trendingCryptoList}
      device={breakpoint}
      onClickItem={onClickItem}
      loading={isLoadingTrendingTokens}
    />
  );
};

export default TrendingCardListContainer;
