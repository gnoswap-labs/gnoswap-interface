import { generateBarAreaDatas } from "@common/utils/test-util";
import MyPositionCardList from "@components/common/my-position-card-list/MyPositionCardList";
import { PoolPosition } from "@containers/earn-my-position-container/EarnMyPositionContainer";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ValuesType } from "utility-types";

export const POSITION_CONTENT_LABEL = {
  VALUE: "Value",
  APR: "APR",
  CURRENT_PRICE: "Current Price",
  MIN_PRICE: "Min Price",
  MAX_PRICE: "Max Price",
  STAR_TAG: "✨",
} as const;

export type POSITION_CONTENT_LABEL = ValuesType<typeof POSITION_CONTENT_LABEL>;

export const dummyPosition: PoolPosition[] = [
  {
    tokenPair: {
      tokenA: {
        path: Math.floor(Math.random() * 50 + 1).toString(),
        name: "HEX",
        symbol: "HEX",
        amount: {
          value: "18,500.18",
          denom: "gnot",
        },
        logoURI:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
      },
      tokenB: {
        path: Math.floor(Math.random() * 50 + 1).toString(),
        name: "USDCoin",
        symbol: "USDC",
        amount: {
          value: "18,500.18",
          denom: "gnot",
        },
        logoURI:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
      },
    },
    rewards: [],
    feeRate: "0.05%",
    stakeType: "Unstaked",
    value: "$18,500.10",
    apr: "108.21%",
    inRange: false,
    currentPriceAmount: "1184.24 GNOS per ETH",
    minPriceAmount: "1.75 GNOT Per GNOS",
    maxPriceAmount: "2.25 GNOT Per GNOS",
    currentTick: 18,
    minTick: 10,
    maxTick: 110,
    minLabel: "-80%",
    maxLabel: "-10%",
    ticks: generateBarAreaDatas()
  },
  {
    tokenPair: {
      tokenA: {
        path: Math.floor(Math.random() * 50 + 1).toString(),
        name: "HEX",
        symbol: "HEX",
        amount: {
          value: "18,500.18",
          denom: "gnot",
        },
        logoURI:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
      },
      tokenB: {
        path: Math.floor(Math.random() * 50 + 1).toString(),
        name: "USDCoin",
        symbol: "USDC",
        amount: {
          value: "18,500.18",
          denom: "gnot",
        },
        logoURI:
          "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
      },
    },
    rewards: [
      {
        token: {
          path: Math.floor(Math.random() * 50 + 1).toString(),
          name: "HEX",
          symbol: "HEX",
          amount: {
            value: "18,500.18",
            denom: "gnot",
          },
          logoURI:
            "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
        },
        amount: {
          value: "18,500.18",
          denom: "gnot",
        },
      },
    ],
    feeRate: "0.05%",
    stakeType: "Staked",
    value: "$18,500.10",
    apr: "108.21%",
    inRange: true,
    currentPriceAmount: "1184.24 GNOS per ETH",
    minPriceAmount: "1.75 GNOT Per GNOS",
    maxPriceAmount: "2.25 GNOT Per GNOS",
    currentTick: 18,
    ticks: generateBarAreaDatas()
  },
];

export const dummyPositionList = [...dummyPosition, ...dummyPosition];

interface MyPositionCardListContainerProps {
  loadMore?: boolean;
}

const MyPositionCardListContainer: React.FC<
  MyPositionCardListContainerProps
> = () => {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentIndex, setCurrentIndex] = useState(0);
  const { width } = useWindowSize();
  const [mobile, setMobile] = useState(false);
  const handleResize = () => {
    if (typeof window !== "undefined") {
      window.innerWidth < 1000 ? setMobile(true) : setMobile(false);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const movePoolDetail = (id: string) => {
    router.push(`/earn/pool/${id}`);
  };

  const onClickLoadMore = () => {
    // Todo
  };

  return (
    <MyPositionCardList
      loadMore={true}
      isFetched={true}
      onClickLoadMore={onClickLoadMore}
      positions={dummyPositionList}
      movePoolDetail={movePoolDetail}
      currentIndex={currentIndex}
      mobile={mobile}
      width={width}
      showPagination={false}
      showLoadMore={false}
    />
  );
};

export default MyPositionCardListContainer;
