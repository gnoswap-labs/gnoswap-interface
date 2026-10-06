import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";

import { RefetchInterval } from "@common/values";
import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import { useClearModal } from "@hooks/common/use-clear-modal";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import useCustomRouter from "@hooks/common/use-custom-router";
import { useLoading } from "@hooks/common/use-loading";
import { useGnotToGnot } from "@hooks/token/data/use-gnot-wugnot";
import { useTokenWarningModal } from "@hooks/token/ui/use-token-warning-modal";
import { useGetToken, useGetTokenPrices } from "@query/token";
import { TokenState } from "@states/index";
import { checkPositivePrice } from "@utils/common";
import { formatPrice } from "@utils/new-number-utils";

import TokenChart, { type TokenInfo } from "../../components/token-chart/TokenChart";

export const dummyTokenInfo: TokenInfo = {
  token: {
    name: "",
    symbol: "",
    displaySymbol: "",
    image: "",
    pkg_path: "",
    decimals: 1,
    description: "",
    website_url: "",
  },
  priceInfo: {
    amount: {
      value: "",
      denom: "",
      status: MATH_NEGATIVE_TYPE.NONE,
    },
    priceGradeType: "NONE",
    changedRate: "0",
  },
};

const priceChangeDetailInit = {
  latestPrice: "",
  priceToday: "",
  price1h: "",
  price2h: "",
  price1d: "",
  price2d: "",
  price7d: "",
  price8d: "",
  price30d: "",
  price31d: "",
  price60d: "",
  price61d: "",
  price90d: "",
  price91d: "",
};

const TokenChartContainer: React.FC = () => {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>(dummyTokenInfo);
  const router = useCustomRouter();
  const [fromSelectToken, setFromSelectToken] = useAtom(TokenState.fromSelectToken);
  const clearModal = useClearModal();
  const { gnot, wugnotPath, getGnotPath } = useGnotToGnot();
  const { gnoswapApiClient } = useGnoswapContext();
  const { isLoading: isLoadingCommon } = useLoading();

  const { openModal: openWarningModal } = useTokenWarningModal({
    onClickConfirm: () => {
      setFromSelectToken(false);
      clearModal();
    },
    onClickClose: () => {
      router.push("/");
    },
  });
  const path = router.getTokenPath();
  const { data: tokenB, isLoading } = useGetToken(path, {
    enabled: !!path,
  });

  const { data: { priceGradeType, usd: currentPrice, pricesBefore = priceChangeDetailInit } = {} } = useGetTokenPrices(
    path === "ugnot" ? wugnotPath : path,
    {
      enabled: !!path,
      refetchInterval: RefetchInterval.Frequent,
    },
  );

  useEffect(() => {
    if (tokenB) {
      const dataToday = checkPositivePrice(pricesBefore.latestPrice, pricesBefore.price1d, {
        displayStatusSign: false,
      });
      setTokenInfo(() => ({
        token: {
          name: getGnotPath(tokenB).name,
          symbol: getGnotPath(tokenB).symbol,
          displaySymbol: getGnotPath(tokenB).displaySymbol,
          image: getGnotPath(tokenB).logoURI,
          pkg_path: getGnotPath(tokenB).path,
          decimals: 1,
          description: tokenB.description || "",
          website_url: tokenB.websiteURL || "",
        },
        priceInfo: {
          amount: {
            value: formatPrice(currentPrice, { isKMB: false, forcedDecimals: true }),
            denom: "USD",
            status: dataToday.status,
          },
          priceGradeType: priceGradeType || "NONE",
          changedRate: dataToday.percentDisplay,
        },
      }));
      if (!fromSelectToken && !tokenB.logoURI) {
        openWarningModal(tokenB);
      }
    }
  }, [
    router.query,
    pricesBefore.latestPrice,
    currentPrice,
    tokenB,
    gnot,
    pricesBefore.priceToday,
    fromSelectToken,
    priceGradeType,
  ]);

  return (
    <TokenChart
      tokenInfo={tokenInfo}
      loading={isLoading || isLoadingCommon}
      candleClient={gnoswapApiClient}
      candlePath={(path === "ugnot" ? wugnotPath : path) || undefined}
      candleSymbol={tokenB?.displaySymbol || ""}
    />
  );
};

export default TokenChartContainer;
