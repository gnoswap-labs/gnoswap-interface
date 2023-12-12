import React, { useMemo } from "react";
import TokenInfoContent from "@components/token/token-info-content/TokenInfoContent";
import { MATH_NEGATIVE_TYPE } from "@constants/option.constant";
import { useGetTokenDetailByPath } from "src/react-query/token";
import { useRouter } from "next/router";
import { convertLargePrice } from "@utils/stake-position-utils";

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
  price91d: ""
};

export const getChange = (currentPrice: number, checkPrice: number) => {
  return checkPrice >= currentPrice ? ((checkPrice / currentPrice - 1) * 100).toFixed(2) : ((1 - checkPrice / currentPrice) * 100).toFixed(2);
};

const TokenInfoContentContainer: React.FC = () => {
  const router = useRouter();
  const { data: { market = marketInformationInit, pricesBefore = priceChangeDetailInit } = {}, isLoading } = useGetTokenDetailByPath(router.query["tokenB"] as string, { enabled: !!router.query["tokenB"]});

  const marketInformation = useMemo(() => {
    return {
      popularity: market.popularity ? `#${Number(market.popularity)}` : "-",
      tvl: market.tvl ? `$${convertLargePrice(market.tvl)}` : "-",
      volume24h: market.volume24h ? `$${convertLargePrice(market.volume24h)}` : "-",
      fees24h: market.fees24h ? `$${convertLargePrice(market.fees24h)}` : "-",
    };
  }, [market]);

  const priceInfomation = useMemo(() => {
    const price1h = getChange(Number(pricesBefore.latestPrice), Number(pricesBefore.price1h));
    const isEmpty1h = !pricesBefore.latestPrice || !pricesBefore.price1h;

    const price1d = getChange(Number(pricesBefore.latestPrice), Number(pricesBefore.price1d));
    const isEmpty1d = !pricesBefore.latestPrice || !pricesBefore.price1d;

    const price7d = getChange(Number(pricesBefore.latestPrice), Number(pricesBefore.price7d));
    const isEmpty7d = !pricesBefore.latestPrice || !pricesBefore.price7d;

    const price30d = getChange(Number(pricesBefore.latestPrice), Number(pricesBefore.price30d));
    const isEmpty30d = !pricesBefore.latestPrice || !pricesBefore.price30d;

    const is1hStatus: MATH_NEGATIVE_TYPE = isEmpty1h ? MATH_NEGATIVE_TYPE.NONE : Number(price1h) >= 0 ? MATH_NEGATIVE_TYPE.POSITIVE : MATH_NEGATIVE_TYPE.NEGATIVE;
    const is1dStatus: MATH_NEGATIVE_TYPE = isEmpty1d ? MATH_NEGATIVE_TYPE.NONE : Number(price1d) >= 0 ? MATH_NEGATIVE_TYPE.POSITIVE : MATH_NEGATIVE_TYPE.NEGATIVE;
    const is7dStatus: MATH_NEGATIVE_TYPE = isEmpty7d ? MATH_NEGATIVE_TYPE.NONE : Number(price7d) >= 0 ? MATH_NEGATIVE_TYPE.POSITIVE : MATH_NEGATIVE_TYPE.NEGATIVE;
    const is30dStatus: MATH_NEGATIVE_TYPE = isEmpty30d ? MATH_NEGATIVE_TYPE.NONE : Number(price30d) >= 0 ? MATH_NEGATIVE_TYPE.POSITIVE : MATH_NEGATIVE_TYPE.NEGATIVE;

    return { 
      priceChange1h: {
        status: is1hStatus,
        value: is1hStatus === MATH_NEGATIVE_TYPE.NONE ? "-" : `${is1hStatus === MATH_NEGATIVE_TYPE.NEGATIVE ? "" : "+"}${price1h}%`,
      },
      priceChange24h: {
        status: is1dStatus,
        value: is1dStatus === MATH_NEGATIVE_TYPE.NONE ? "-" : `${is1dStatus === MATH_NEGATIVE_TYPE.NEGATIVE ? "" : "+"}${price1d}%`,
      },
      priceChange7d: {
        status: is7dStatus,
        value: is7dStatus === MATH_NEGATIVE_TYPE.NONE ? "-" : `${is7dStatus === MATH_NEGATIVE_TYPE.NEGATIVE ? "" : "+"}${price7d}%`,
      },
      priceChange30d: {
        status: is30dStatus,
        value: is30dStatus === MATH_NEGATIVE_TYPE.NONE ? "-" : `${is30dStatus === MATH_NEGATIVE_TYPE.NEGATIVE ? "" : "+"}${price30d}%`,
      }
    };
  }, [pricesBefore]);

  const pricePerformance = useMemo(() => {
    const priceToday = getChange(Number(pricesBefore.latestPrice), Number(pricesBefore.priceToday));
    const isEmptyToday = !pricesBefore.latestPrice || !pricesBefore.priceToday;

    const price30d = getChange(Number(pricesBefore.latestPrice), Number(pricesBefore.price30d));
    const isEmpty30d = !pricesBefore.latestPrice || !pricesBefore.price30d;

    const price60d = getChange(Number(pricesBefore.latestPrice), Number(pricesBefore.price60d));
    const isEmpty60d = !pricesBefore.latestPrice || !pricesBefore.price60d;

    const price90d = getChange(Number(pricesBefore.latestPrice), Number(pricesBefore.price90d));
    const isEmpty90d = !pricesBefore.latestPrice || !pricesBefore.price90d;

    const isTodayPositive: MATH_NEGATIVE_TYPE = isEmptyToday ? MATH_NEGATIVE_TYPE.NONE : Number(priceToday) >= 0 ? MATH_NEGATIVE_TYPE.POSITIVE : MATH_NEGATIVE_TYPE.NEGATIVE;
    const is30Positive: MATH_NEGATIVE_TYPE = isEmpty30d ? MATH_NEGATIVE_TYPE.NONE : Number(price30d) >= 0 ? MATH_NEGATIVE_TYPE.POSITIVE : MATH_NEGATIVE_TYPE.NEGATIVE;
    const is60Positive: MATH_NEGATIVE_TYPE = isEmpty60d ? MATH_NEGATIVE_TYPE.NONE : Number(price60d) >= 0 ? MATH_NEGATIVE_TYPE.POSITIVE : MATH_NEGATIVE_TYPE.NEGATIVE;
    const is90Positive: MATH_NEGATIVE_TYPE = isEmpty90d ? MATH_NEGATIVE_TYPE.NONE : Number(price90d) >= 0 ? MATH_NEGATIVE_TYPE.POSITIVE : MATH_NEGATIVE_TYPE.NEGATIVE;
    return [
      {
        createdAt: "Today",
        amount: {
          status: isTodayPositive,
          value: isTodayPositive === MATH_NEGATIVE_TYPE.NONE ? "-" : `${isTodayPositive === MATH_NEGATIVE_TYPE.NEGATIVE ? "-" : "+"}$${convertLargePrice((Math.abs(Number(pricesBefore.priceToday) - Number(pricesBefore.latestPrice))).toString())}`,
        },
        change: {
          status: isTodayPositive,
          value: isTodayPositive === MATH_NEGATIVE_TYPE.NONE ? "-" : `${isTodayPositive === MATH_NEGATIVE_TYPE.NEGATIVE ? "" : "+"}${priceToday}%`,
        },
      },
      {
        createdAt: "30 days",
        amount: {
          status: is30Positive,
          value: is30Positive === MATH_NEGATIVE_TYPE.NONE ? "-" : `${is30Positive === MATH_NEGATIVE_TYPE.NEGATIVE ? "-" : "+"}$${convertLargePrice((Math.abs(Number(pricesBefore.price30d) - Number(pricesBefore.latestPrice))).toString())}`,
        },
        change: {
          status: is30Positive,
          value: is30Positive === MATH_NEGATIVE_TYPE.NONE ? "-" : `${is30Positive === MATH_NEGATIVE_TYPE.NEGATIVE ? "" : "+"}${convertLargePrice(price30d)}%`,
        },
      },
      {
        createdAt: "60 days",
        amount: {
          status: is60Positive,
          value: is60Positive === MATH_NEGATIVE_TYPE.NONE ? "-" : `${is60Positive === MATH_NEGATIVE_TYPE.NEGATIVE ? "-" : "+"}$${convertLargePrice((Math.abs(Number(pricesBefore.price60d) - Number(pricesBefore.latestPrice))).toString())}`,
        },
        change: {
          status: is60Positive,
          value: is60Positive === MATH_NEGATIVE_TYPE.NONE ? "-" : `${is60Positive === MATH_NEGATIVE_TYPE.NEGATIVE ? "" : "+"}${convertLargePrice(price60d)}%`,
        },
      },
      {
        createdAt: "90 days",
        amount: {
          status: is90Positive,
          value: is90Positive === MATH_NEGATIVE_TYPE.NONE ? "-" : `${is90Positive === MATH_NEGATIVE_TYPE.NEGATIVE ? "-" : "+"}$${convertLargePrice((Math.abs(Number(pricesBefore.price90d) - Number(pricesBefore.latestPrice))).toString())}`,
        },
        change: {
          status: is90Positive,
          value: is90Positive === MATH_NEGATIVE_TYPE.NONE ? "-" : `${is90Positive === MATH_NEGATIVE_TYPE.NEGATIVE ? "" : "+"}${convertLargePrice(price90d)}%`,
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
