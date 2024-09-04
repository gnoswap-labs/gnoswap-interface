import React, { useMemo } from "react";

import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import useCustomRouter from "@hooks/common/use-custom-router";
import { useLoading } from "@hooks/common/use-loading";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { TokenChangeInfo } from "@models/token/token-change-info";
import { TokenModel } from "@models/token/token-model";
import { useGetPoolList } from "@query/pools";
import {
  useGetChainInfo,
  useGetTokenDetails,
  useGetTokens,
} from "@query/token";
import { IGainer } from "@repositories/token";
import { formatPrice, formatRate } from "@utils/new-number-utils";

import GainerAndLoser from "../../components/gainer-and-loser/GainerAndLoser";

const GainerAndLoserContainer: React.FC = () => {
  const router = useCustomRouter();
  const path = router.getTokenPath();
  const { data: { tokens = [] } = {}, isLoading: isLoadingListToken } =
    useGetTokens();
  const { data: { gainers = [], losers = [] } = {}, isLoading } =
    useGetChainInfo();
  const { gnot, wugnotPath } = useGnotToGnot();
  const { isLoading: isLoadingGetPoolList } = useGetPoolList();
  const { isLoading: isLoadingTokenDetail } = useGetTokenDetails(
    path === "gnot" ? wugnotPath : path,
    {
      enabled: !!path,
    },
  );
  const { isLoading: isLoadingCommon } = useLoading();

  const gainersList: TokenChangeInfo[] = useMemo(() => {
    return gainers?.slice(0, 3).map((item: IGainer) => {
      const isGnotPath = item.tokenPath === wugnotPath;
      const priceChange = item.tokenPrice24hChange || 0;
      const temp: TokenModel =
        tokens.filter(
          (token: TokenModel) => token.path === item.tokenPath,
        )?.[0] || {};
      return {
        path: isGnotPath ? gnot?.path || "" : item.tokenPath,
        name: isGnotPath ? gnot?.name || "" : temp.name,
        symbol: isGnotPath ? gnot?.symbol || "" : temp.symbol,
        logoURI: isGnotPath ? gnot?.logoURI || "" : temp.logoURI,
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
    });
  }, [
    gainers,
    wugnotPath,
    tokens,
    gnot?.path,
    gnot?.name,
    gnot?.symbol,
    gnot?.logoURI,
  ]);

  const loserList = useMemo(() => {
    return losers?.slice(0, 3)?.map((item: IGainer) => {
      const isGnotPath = item.tokenPath === wugnotPath;
      const priceChange = item.tokenPrice24hChange || 0;
      const temp: TokenModel =
        tokens.filter(
          (token: TokenModel) => token.path === item.tokenPath,
        )?.[0] || {};
      return {
        path: isGnotPath ? gnot?.path || "" : item.tokenPath,
        name: isGnotPath ? gnot?.name || "" : temp.name,
        symbol: isGnotPath ? gnot?.symbol || "" : temp.symbol,
        logoURI: isGnotPath ? gnot?.logoURI || "" : temp.logoURI,
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
    });
  }, [
    losers,
    wugnotPath,
    tokens,
    gnot?.path,
    gnot?.name,
    gnot?.symbol,
    gnot?.logoURI,
  ]);

  return (
    <GainerAndLoser
      gainers={gainersList}
      losers={loserList}
      loadingLose={
        isLoading ||
        isLoadingListToken ||
        isLoadingGetPoolList ||
        isLoadingTokenDetail ||
        isLoadingCommon
      }
      loadingGain={
        isLoading ||
        isLoadingListToken ||
        isLoadingGetPoolList ||
        isLoadingTokenDetail ||
        isLoadingCommon
      }
    />
  );
};

export default GainerAndLoserContainer;
