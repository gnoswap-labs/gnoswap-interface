import React, { useMemo } from "react";

import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import useCustomRouter from "@hooks/common/use-custom-router";
import { useLoading } from "@hooks/common/use-loading";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { TokenModel } from "@models/token/token-model";
import { useGetPoolList } from "@query/pools";
import {
  useGetChainInfo,
  useGetTokenDetails,
  useGetTokens,
} from "@query/token";
import { ITrending } from "@repositories/token";
import { formatPrice, formatRate } from "@utils/new-number-utils";

import TrendingCryptoCardList from "../../components/trending-crypto-card-list/TrendingCryptoCardList";

const TrendingCryptoCardListContainer: React.FC = () => {
  const router = useCustomRouter();
  const path = router.getTokenPath();
  const { data: { tokens = [] } = {}, isLoading: isLoadingListToken } =
    useGetTokens();
  const { data: { trending = [] } = {}, isLoading } = useGetChainInfo();
  const { gnot, wugnotPath } = useGnotToGnot();
  const { isLoading: isLoadingTokenDetail } = useGetTokenDetails(
    path === "gnot" ? wugnotPath : path,
    { enabled: !!path },
  );
  const { isLoading: isLoadingGetPoolList } = useGetPoolList();
  const { isLoading: isLoadingCommon } = useLoading();

  const trendingCryptoList = useMemo(() => {
    return (trending ?? [])
      ?.map((item: ITrending) => {
        const temp: TokenModel =
          tokens.filter(
            (token: TokenModel) => token.path === item.tokenPath,
          )?.[0] || {};
        const priceChange = item.tokenPrice24hChange || 0;
        return {
          path:
            item.tokenPath === wugnotPath ? gnot?.path || "" : item.tokenPath,
          name: item.tokenPath === wugnotPath ? gnot?.name || "" : temp.name,
          symbol:
            item.tokenPath === wugnotPath ? gnot?.symbol || "" : temp.symbol,
          logoURI:
            item.tokenPath === wugnotPath ? gnot?.logoURI || "" : temp.logoURI,
          price: formatPrice(item.tokenPrice),
          change: {
            status:
              Number(priceChange) >= 0
                ? MATH_NEGATIVE_TYPE.POSITIVE
                : MATH_NEGATIVE_TYPE.NEGATIVE,
            value: formatRate(priceChange, {
              showSign: true,
              allowZeroDecimals: true,
            }),
          },
        };
      })
      .slice(0, 5);
  }, [tokens, trending, gnot, wugnotPath]);

  return (
    <TrendingCryptoCardList
      list={trendingCryptoList}
      loading={
        isLoading ||
        isLoadingListToken ||
        isLoadingTokenDetail ||
        isLoadingGetPoolList ||
        isLoadingCommon
      }
    />
  );
};

export default TrendingCryptoCardListContainer;
