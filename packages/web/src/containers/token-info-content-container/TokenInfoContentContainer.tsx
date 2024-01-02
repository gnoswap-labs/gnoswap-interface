import React, { useMemo } from "react";
import TokenInfoContent from "@components/token/token-info-content/TokenInfoContent";
import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import { useGetTokenDetailByPath } from "@query/token";
import { useRouter } from "next/router";
import { convertToKMB } from "@utils/stake-position-utils";
import { checkPositivePrice } from "@utils/common";
const WRAPPED_GNOT_PATH = process.env.NEXT_PUBLIC_WRAPPED_GNOT_PATH || "";

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
  tvl: "",
  volume24h: "",
  fees24h: "",
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
  const router = useRouter();
  const {
    data: {
      market = marketInformationInit,
      pricesBefore = priceChangeDetailInit,
    } = {},
    isLoading,
  } = useGetTokenDetailByPath(
    router.query["tokenB"] === "gnot"
      ? WRAPPED_GNOT_PATH
      : (router.query["tokenB"] as string),
    { enabled: !!router.query["tokenB"] },
  );

  const marketInformation = useMemo(() => {
    return {
      popularity: market.popularity ? `#${Number(market.popularity)}` : "-",
      tvl: market.tvl ? `$${convertToKMB(market.tvl)}` : "-",
      volume24h: market.volume24h
        ? `$${convertToKMB(market.volume24h)}`
        : "-",
      fees24h: market.fees24h ? `$${convertToKMB(market.fees24h)}` : "-",
    };
  }, [market]);

  const priceInfomation = useMemo(() => {
    const data1H = checkPositivePrice(
      pricesBefore.latestPrice,
      pricesBefore.price1h,
    );
    const data1D = checkPositivePrice(
      pricesBefore.latestPrice,
      pricesBefore.price1d,
    );
    const data7D = checkPositivePrice(
      pricesBefore.latestPrice,
      pricesBefore.price7d,
    );
    const data30D = checkPositivePrice(
      pricesBefore.latestPrice,
      pricesBefore.price30d,
    );

    return {
      priceChange1h: {
        status: data1H.status,
        value: data1H.percent,
      },
      priceChange24h: {
        status: data1D.status,
        value: data1D.percent,
      },
      priceChange7d: {
        status: data7D.status,
        value: data7D.percent,
      },
      priceChange30d: {
        status: data30D.status,
        value: data30D.percent,
      },
    };
  }, [pricesBefore]);

  const pricePerformance = useMemo(() => {
    const dataToday = checkPositivePrice(
      pricesBefore.latestPrice,
      pricesBefore.priceToday,
      6,
    );
    const data30day = checkPositivePrice(
      pricesBefore.latestPrice,
      pricesBefore.price30d,
      6,
    );
    const data60day = checkPositivePrice(
      pricesBefore.latestPrice,
      pricesBefore.price60d,
      6,
    );
    const data90day = checkPositivePrice(
      pricesBefore.latestPrice,
      pricesBefore.price90d,
      6,
    );
    return [
      {
        createdAt: "Today",
        amount: {
          status: dataToday.status,
          value: dataToday.price,
        },
        change: {
          status: dataToday.status,
          value: dataToday.percent,
        },
      },
      {
        createdAt: "30 days",
        amount: {
          status: data30day.status,
          value: data30day.price,
        },
        change: {
          status: data30day.status,
          value: data30day.percent,
        },
      },
      {
        createdAt: "60 days",
        amount: {
          status: data60day.status,
          value: data60day.price,
        },
        change: {
          status: data60day.status,
          value: data60day.percent,
        },
      },
      {
        createdAt: "90 days",
        amount: {
          status: data90day.status,
          value: data90day.price,
        },
        change: {
          status: data90day.status,
          value: data90day.percent,
        },
      },
    ];
  }, [pricesBefore]);

  return (
    <TokenInfoContent
      performance={pricePerformance}
      priceInfo={priceInfomation}
      marketInfo={marketInformation}
      loadingPricePerform={isLoading}
      loadingPriceInfo={isLoading}
      loadingMarketInfo={isLoading}
    />
  );
};

export default TokenInfoContentContainer;