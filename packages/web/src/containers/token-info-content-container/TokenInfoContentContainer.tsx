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
  popularity: "#1",
  tvl: "$0",
  volume24h: "$0",
  fees24h: "$0",
};

const priceChangeDetailInit = {
  priceToday: "0",
  changeToday: "0",
  price1h: "0",
  change1h: "0",
  price1d: "0",
  change1d: "0",
  price7d: "0",
  change7d: "0",
  price30d: "0",
  change30d: "0",
  price60d: "0",
  change60d: "0",
  price90d: "0",
  change90d: "0",
};


const TokenInfoContentContainer: React.FC = () => {
  const router = useRouter();
  const { data: { market = marketInformationInit, priceChangeDetail = priceChangeDetailInit } = {}, isLoading } = useGetTokenDetailByPath(router.query["tokenB"] as string, { enabled: !!router.query["tokenB"]});

  const marketInformation = useMemo(() => {
    return {
      popularity: `#${convertLargePrice(market.popularity)}`,
      tvl: `$${convertLargePrice(market.tvl)}`,
      volume24h: `$${convertLargePrice(market.volume24h)}`,
      fees24h: `$${convertLargePrice(market.fees24h)}`,
    };
  }, [market]);

  const priceInfomation = useMemo(() => {
    return { 
      priceChange1h: {
        status: Number(priceChangeDetail.change1h) >= 0 ? MATH_NEGATIVE_TYPE.POSITIVE : MATH_NEGATIVE_TYPE.NEGATIVE,
        value: `${Number(priceChangeDetail.change1h).toFixed(2)}%`,
      },
      priceChange24h: {
        status: Number(priceChangeDetail.change1d) >= 0 ? MATH_NEGATIVE_TYPE.POSITIVE : MATH_NEGATIVE_TYPE.NEGATIVE,
        value: `${Number(priceChangeDetail.change1d).toFixed(2)}%`,
      },
      priceChange7d: {
        status: Number(priceChangeDetail.change7d) >= 0 ? MATH_NEGATIVE_TYPE.POSITIVE : MATH_NEGATIVE_TYPE.NEGATIVE,
        value: `${Number(priceChangeDetail.change7d).toFixed(2)}%`,
      },
      priceChange30d: {
        status: Number(priceChangeDetail.change30d) >= 0 ? MATH_NEGATIVE_TYPE.POSITIVE : MATH_NEGATIVE_TYPE.NEGATIVE,
        value: `${Number(priceChangeDetail.change30d).toFixed(2)}%`,
      }
    };
  }, [priceChangeDetail]);

  const pricePerformance = useMemo(() => {
    const isTodayPositive= Number(priceChangeDetail.changeToday) >= 0;
    const is30Positive= Number(priceChangeDetail.changeToday) >= 0;
    const is60Positive= Number(priceChangeDetail.changeToday) >= 0;
    const is90Positive= Number(priceChangeDetail.changeToday) >= 0;
    return [
      {
        createdAt: "Today",
        amount: {
          status: isTodayPositive ? MATH_NEGATIVE_TYPE.POSITIVE : MATH_NEGATIVE_TYPE.NEGATIVE,
          value: `${!isTodayPositive ? "-" : ""}$${convertLargePrice(priceChangeDetail.changeToday)}`,
        },
        change: {
          status: isTodayPositive ? MATH_NEGATIVE_TYPE.POSITIVE : MATH_NEGATIVE_TYPE.NEGATIVE,
          value: `${convertLargePrice(priceChangeDetail.changeToday)}%`,
        },
      },
      {
        createdAt: "30 days",
        amount: {
          status: is30Positive ? MATH_NEGATIVE_TYPE.POSITIVE : MATH_NEGATIVE_TYPE.NEGATIVE,
          value: `${!isTodayPositive ? "-" : ""}$${convertLargePrice(priceChangeDetail.change30d)}`,
        },
        change: {
          status: is30Positive ? MATH_NEGATIVE_TYPE.POSITIVE : MATH_NEGATIVE_TYPE.NEGATIVE,
          value: `${convertLargePrice(priceChangeDetail.change30d)}%`,
        },
      },
      {
        createdAt: "60 days",
        amount: {
          status: is60Positive ? MATH_NEGATIVE_TYPE.POSITIVE : MATH_NEGATIVE_TYPE.NEGATIVE,
          value: `${!isTodayPositive ? "-" : ""}$${convertLargePrice(priceChangeDetail.change60d)}`,
        },
        change: {
          status: is60Positive ? MATH_NEGATIVE_TYPE.POSITIVE : MATH_NEGATIVE_TYPE.NEGATIVE,
          value: `${convertLargePrice(priceChangeDetail.change60d)}%`,
        },
      },
      {
        createdAt: "90 days",
        amount: {
          status: is90Positive ? MATH_NEGATIVE_TYPE.POSITIVE : MATH_NEGATIVE_TYPE.NEGATIVE,
          value: `${!isTodayPositive ? "-" : ""}$${convertLargePrice(priceChangeDetail.change90d)}`,
        },
        change: {
          status: is90Positive ? MATH_NEGATIVE_TYPE.POSITIVE : MATH_NEGATIVE_TYPE.NEGATIVE,
          value: `${convertLargePrice(priceChangeDetail.change90d)}%`,
        },
      },
    ];
  }, [priceChangeDetail]);

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
