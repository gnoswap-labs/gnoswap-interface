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
  priceToday: "",
  changeToday: "",
  price1h: "",
  change1h: "",
  price1d: "",
  change1d: "",
  price7d: "",
  change7d: "",
  price30d: "",
  change30d: "",
  price60d: "",
  change60d: "",
  price90d: "",
  change90d: "",
};


const TokenInfoContentContainer: React.FC = () => {
  const router = useRouter();
  const { data: { market = marketInformationInit, priceChangeDetail = priceChangeDetailInit } = {}, isLoading } = useGetTokenDetailByPath(router.query["tokenB"] as string, { enabled: !!router.query["tokenB"]});

  const marketInformation = useMemo(() => {
    return {
      popularity: market.popularity ? `#${Number(market.popularity)}` : "-",
      tvl: market.tvl ? `$${convertLargePrice(market.tvl)}` : "-",
      volume24h: market.volume24h ? `$${convertLargePrice(market.volume24h)}` : "-",
      fees24h: market.fees24h ? `$${convertLargePrice(market.fees24h)}` : "-",
    };
  }, [market]);

  const priceInfomation = useMemo(() => {
    return { 
      priceChange1h: {
        status: !priceChangeDetail.change1h ? MATH_NEGATIVE_TYPE.NONE : Number(priceChangeDetail.change1h) >= 0 ? MATH_NEGATIVE_TYPE.POSITIVE : MATH_NEGATIVE_TYPE.NEGATIVE,
        value: priceChangeDetail.change1h ? `${Number(priceChangeDetail.change1h).toFixed(2)}%` : "-",
      },
      priceChange24h: {
        status: !priceChangeDetail.change1d ? MATH_NEGATIVE_TYPE.NONE : Number(priceChangeDetail.change1d) >= 0 ? MATH_NEGATIVE_TYPE.POSITIVE : MATH_NEGATIVE_TYPE.NEGATIVE,
        value: priceChangeDetail.change1d ? `${Number(priceChangeDetail.change1d).toFixed(2)}%` : "-",
      },
      priceChange7d: {
        status: !priceChangeDetail.change7d ? MATH_NEGATIVE_TYPE.NONE : Number(priceChangeDetail.change7d) >= 0 ? MATH_NEGATIVE_TYPE.POSITIVE : MATH_NEGATIVE_TYPE.NEGATIVE,
        value: priceChangeDetail.change7d ? `${Number(priceChangeDetail.change7d).toFixed(2)}%` : "-",
      },
      priceChange30d: {
        status: !priceChangeDetail.change30d ? MATH_NEGATIVE_TYPE.NONE : Number(priceChangeDetail.change30d) >= 0 ? MATH_NEGATIVE_TYPE.POSITIVE : MATH_NEGATIVE_TYPE.NEGATIVE,
        value: priceChangeDetail.change30d ? `${Number(priceChangeDetail.change30d).toFixed(2)}%` : "-",
      }
    };
  }, [priceChangeDetail]);

  const pricePerformance = useMemo(() => {
    const isTodayPositive: MATH_NEGATIVE_TYPE = !priceChangeDetail.changeToday ? MATH_NEGATIVE_TYPE.NONE : Number(priceChangeDetail.changeToday) >= 0 ? MATH_NEGATIVE_TYPE.POSITIVE : MATH_NEGATIVE_TYPE.NEGATIVE;
    const is30Positive: MATH_NEGATIVE_TYPE = !priceChangeDetail.change30d ? MATH_NEGATIVE_TYPE.NONE : Number(priceChangeDetail.change30d) >= 0 ? MATH_NEGATIVE_TYPE.POSITIVE : MATH_NEGATIVE_TYPE.NEGATIVE;
    const is60Positive: MATH_NEGATIVE_TYPE = !priceChangeDetail.change60d ? MATH_NEGATIVE_TYPE.NONE : Number(priceChangeDetail.change60d) >= 0 ? MATH_NEGATIVE_TYPE.POSITIVE : MATH_NEGATIVE_TYPE.NEGATIVE;
    const is90Positive: MATH_NEGATIVE_TYPE = !priceChangeDetail.change90d ? MATH_NEGATIVE_TYPE.NONE : Number(priceChangeDetail.change90d) >= 0 ? MATH_NEGATIVE_TYPE.POSITIVE : MATH_NEGATIVE_TYPE.NEGATIVE;
    return [
      {
        createdAt: "Today",
        amount: {
          status: isTodayPositive,
          value: isTodayPositive === MATH_NEGATIVE_TYPE.NONE ? "-" : `${isTodayPositive === MATH_NEGATIVE_TYPE.NEGATIVE ? "-" : "+"}$${convertLargePrice(priceChangeDetail.changeToday)}`,
        },
        change: {
          status: isTodayPositive,
          value: isTodayPositive === MATH_NEGATIVE_TYPE.NONE ? "-" : `${isTodayPositive === MATH_NEGATIVE_TYPE.NEGATIVE ? "-" : "+"}${convertLargePrice(priceChangeDetail.changeToday)}%`,
        },
      },
      {
        createdAt: "30 days",
        amount: {
          status: is30Positive,
          value: is30Positive === MATH_NEGATIVE_TYPE.NONE ? "-" : `${is30Positive === MATH_NEGATIVE_TYPE.NEGATIVE ? "-" : "+"}$${convertLargePrice(priceChangeDetail.change30d)}`,
        },
        change: {
          status: is30Positive,
          value: is30Positive === MATH_NEGATIVE_TYPE.NONE ? "-" : `${is30Positive === MATH_NEGATIVE_TYPE.NEGATIVE ? "-" : "+"}${convertLargePrice(priceChangeDetail.change30d)}%`,
        },
      },
      {
        createdAt: "60 days",
        amount: {
          status: is60Positive,
          value: is60Positive === MATH_NEGATIVE_TYPE.NONE ? "-" : `${is60Positive === MATH_NEGATIVE_TYPE.NEGATIVE ? "-" : "+"}$${convertLargePrice(priceChangeDetail.change60d)}`,
        },
        change: {
          status: is60Positive,
          value: is60Positive === MATH_NEGATIVE_TYPE.NONE ? "-" : `${is60Positive === MATH_NEGATIVE_TYPE.NEGATIVE ? "-" : "+"}${convertLargePrice(priceChangeDetail.change60d)}%`,
        },
      },
      {
        createdAt: "90 days",
        amount: {
          status: is90Positive,
          value: is90Positive === MATH_NEGATIVE_TYPE.NONE ? "-" : `${is90Positive === MATH_NEGATIVE_TYPE.NEGATIVE ? "-" : "+"}$${convertLargePrice(priceChangeDetail.change90d)}`,
        },
        change: {
          status: is90Positive,
          value: is90Positive === MATH_NEGATIVE_TYPE.NONE ? "-" : `${is90Positive === MATH_NEGATIVE_TYPE.NEGATIVE ? "-" : "+"}${convertLargePrice(priceChangeDetail.change90d)}%`,
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
