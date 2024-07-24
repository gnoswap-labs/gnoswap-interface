import React, { useMemo } from "react";
import TokenInfoContent from "@components/token/token-info-content/TokenInfoContent";
import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import { useGetTokenDetailByPath, useGetTokenPricesByPath } from "@query/token";
import { checkPositivePrice } from "@utils/common";
import { useLoading } from "@hooks/common/use-loading";
import { WRAPPED_GNOT_PATH } from "@constants/environment.constant";
import { formatOtherPrice } from "@utils/new-number-utils";
import useCustomRouter from "@hooks/common/use-custom-router";
import { useTranslation } from "react-i18next";

export const performanceInit = [
  {
    createdAt: "Today",
    amount: {
      status: MATH_NEGATIVE_TYPE.NEGATIVE,
      value: "-$152.25",
    },
    change: {
      status: MATH_NEGATIVE_TYPE.POSITIVE,
      value: "+17.43%",
    },
  },
  {
    createdAt: "30 day",
    amount: {
      status: MATH_NEGATIVE_TYPE.NEGATIVE,
      value: "-$152.25",
    },
    change: {
      status: MATH_NEGATIVE_TYPE.POSITIVE,
      value: "+17.43%",
    },
  },
  {
    createdAt: "60 day",
    amount: {
      status: MATH_NEGATIVE_TYPE.NEGATIVE,
      value: "-$152.25",
    },
    change: {
      status: MATH_NEGATIVE_TYPE.POSITIVE,
      value: "+17.43%",
    },
  },
  {
    createdAt: "90 day",
    amount: {
      status: MATH_NEGATIVE_TYPE.NEGATIVE,
      value: "-$152.25",
    },
    change: {
      status: MATH_NEGATIVE_TYPE.POSITIVE,
      value: "+17.43%",
    },
  },
];

export const priceInfomationInit = {
  priceChange1h: {
    status: MATH_NEGATIVE_TYPE.NEGATIVE,
    value: "-54.00%",
  },
  priceChange24h: {
    status: MATH_NEGATIVE_TYPE.POSITIVE,
    value: "+54.00%",
  },
  priceChange7d: {
    status: MATH_NEGATIVE_TYPE.NEGATIVE,
    value: "-54.00%",
  },
  priceChange30d: {
    status: MATH_NEGATIVE_TYPE.POSITIVE,
    value: "+54.00%",
  },
};

export const marketInformationInit = {
  popularity: "",
  lockedTokensUsd: "",
  volumeUsd24h: "",
  feesUsd24h: "",
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

const TokenInfoContentContainer: React.FC = () => {
  const router = useCustomRouter();
  const path = router.getTokenPath();
  const { data: { market = marketInformationInit } = {}, isLoading } =
    useGetTokenDetailByPath(
      path === "gnot" ? WRAPPED_GNOT_PATH : (path as string),
      { enabled: !!path },
    );
  const {
    data: {
      usd: currentPrice = "0",
      feeUsd24h,
      pricesBefore = priceChangeDetailInit,
      marketCap,
    } = {},
  } = useGetTokenPricesByPath(
    path === "gnot" ? WRAPPED_GNOT_PATH : (path as string),
    { enabled: !!path },
  );
  const { isLoading: isLoadingCommon } = useLoading();
  const { t } = useTranslation();

  const marketInformation = useMemo(() => {
    return {
      marketCap: formatOtherPrice(marketCap),
      tvl: formatOtherPrice(market.lockedTokensUsd),
      volume24h: formatOtherPrice(market.volumeUsd24h),
      fees24h: formatOtherPrice(feeUsd24h),
    };
  }, [market.lockedTokensUsd, market.volumeUsd24h, feeUsd24h, marketCap]);

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
