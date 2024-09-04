import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { WRAPPED_GNOT_PATH } from "@constants/environment.constant";
import useCustomRouter from "@hooks/common/use-custom-router";
import { useLoading } from "@hooks/common/use-loading";
import { useGetTokenDetails, useGetTokenPrices } from "@query/token";
import { checkPositivePrice } from "@utils/common";
import { formatOtherPrice } from "@utils/new-number-utils";

import { marketInformationInit } from "../../components/token-info-content/market-information/market-information-list/MarketInformationList";
import TokenInfoContent from "../../components/token-info-content/TokenInfoContent";

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

const TokenInfoContentContainer: React.FC = () => {
  const router = useCustomRouter();
  const path = router.getTokenPath();
  const {
    data: { market = marketInformationInit } = {},
    isLoading,
    isStale: isStaleTokenDetails,
  } = useGetTokenDetails(
    path === "gnot" ? WRAPPED_GNOT_PATH : (path as string),
    {
      enabled: !!path,
    },
  );
  const {
    data: {
      usd: currentPrice = "0",
      feeUsd24h,
      pricesBefore = priceChangeDetailInit,
      marketCap,
    } = {},
    isStale: isStaleTokenPrices,
  } = useGetTokenPrices(
    path === "gnot" ? WRAPPED_GNOT_PATH : (path as string),
    { enabled: !!path },
  );
  const { isLoading: isLoadingCommon } = useLoading();
  const { t } = useTranslation();

  const marketInformation = useMemo(() => {
    const isGnot = path === "gnot";

    return {
      popularity: formatOtherPrice(
        isGnot ? 1_000_000_000 * Number(currentPrice) : marketCap,
      ),
      lockedTokensUsd: formatOtherPrice(market.lockedTokensUsd),
      volumeUsd24h: formatOtherPrice(market.volumeUsd24h),
      feesUsd24h: formatOtherPrice(feeUsd24h),
    };
  }, [
    path,
    currentPrice,
    marketCap,
    market.lockedTokensUsd,
    market.volumeUsd24h,
    feeUsd24h,
  ]);

  const priceInfomation = useMemo(() => {
    const data1H = checkPositivePrice(currentPrice, pricesBefore.price1h);
    const data1D = checkPositivePrice(currentPrice, pricesBefore.price1d);
    const data7D = checkPositivePrice(currentPrice, pricesBefore.price7d);
    const data30D = checkPositivePrice(currentPrice, pricesBefore.price30d);

    return {
      priceChange1h: {
        status: data1H.status,
        value: data1H.percentDisplay,
      },
      priceChange24h: {
        status: data1D.status,
        value: data1D.percentDisplay,
      },
      priceChange7d: {
        status: data7D.status,
        value: data7D.percentDisplay,
      },
      priceChange30d: {
        status: data30D.status,
        value: data30D.percentDisplay,
      },
    };
  }, [
    currentPrice,
    pricesBefore.price1d,
    pricesBefore.price1h,
    pricesBefore.price30d,
    pricesBefore.price7d,
  ]);

  const pricePerformance = useMemo(() => {
    const dataToday = checkPositivePrice(currentPrice, pricesBefore.priceToday);
    const data30day = checkPositivePrice(currentPrice, pricesBefore.price30d);
    const data60day = checkPositivePrice(currentPrice, pricesBefore.price60d);
    const data90day = checkPositivePrice(currentPrice, pricesBefore.price90d);

    return [
      {
        createdAt: t("common:day.today"),
        amount: {
          status: dataToday.status,
          value: dataToday.price,
        },
        change: {
          status: dataToday.status,
          value: dataToday.percentDisplay,
        },
      },
      {
        createdAt: t("common:day.count", {
          count: 30,
        }),
        amount: {
          status: data30day.status,
          value: data30day.price,
        },
        change: {
          status: data30day.status,
          value: data30day.percentDisplay,
        },
      },
      {
        createdAt: t("common:day.count", {
          count: 60,
        }),
        amount: {
          status: data60day.status,
          value: data60day.price,
        },
        change: {
          status: data60day.status,
          value: data60day.percentDisplay,
        },
      },
      {
        createdAt: t("common:day.count", {
          count: 90,
        }),
        amount: {
          status: data90day.status,
          value: data90day.price,
        },
        change: {
          status: data90day.status,
          value: data90day.percentDisplay,
        },
      },
    ];
  }, [
    currentPrice,
    pricesBefore.price30d,
    pricesBefore.price60d,
    pricesBefore.price90d,
    pricesBefore.priceToday,
    t,
  ]);

  useEffect(() => {
    if (isStaleTokenDetails) {
      // refetchTokenDetails();
    }
  }, []);

  useEffect(() => {
    if (isStaleTokenPrices) {
      // refetchTokenPrices();
    }
  }, []);

  return (
    <TokenInfoContent
      performance={pricePerformance}
      priceInfo={priceInfomation}
      marketInfo={marketInformation}
      loadingPricePerform={isLoading || isLoadingCommon}
      loadingPriceInfo={isLoading || isLoadingCommon}
      loadingMarketInfo={isLoading || isLoadingCommon}
    />
  );
};

export default TokenInfoContentContainer;
