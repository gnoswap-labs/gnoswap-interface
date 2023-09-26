import { generateBarAreaDatas } from "@common/utils/test-util";
import EarnMyPositions from "@components/earn/earn-my-positions/EarnMyPositions";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
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

interface PositionToken {
  path: string;
  name: string;
  symbol: string;
  amount: {
    value: string;
    denom: string;
  };
  logoURI: string;
}

export interface PoolPosition {
  tokenPair: {
    tokenA: PositionToken,
    tokenB: PositionToken,
  };
  feeRate: string;
  stakeType: string;
  value: string;
  apr: string;
  inRange: boolean;
  currentPriceAmount: string;
  minPriceAmount: string;
  maxPriceAmount: string;
  rewards: {
    token: PositionToken;
    amount: {
      value: "18,500.18",
      denom: "gnot",
    };
  }[];
  currentTick?: number;
  minTick?: number;
  maxTick?: number;
  minLabel?: string;
  maxLabel?: string;
  ticks: string[];
}

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
    currentTick: 24,
    minTick: 120,
    maxTick: 200,
    minLabel: "-30%",
    maxLabel: "50%",
    ticks: generateBarAreaDatas()
  },
];

export const dummyPositionList = () => [...dummyPosition, ...dummyPosition];

interface EarnMyPositionContainerProps {
  loadMore?: boolean;
}

const EarnMyPositionContainer: React.FC<
  EarnMyPositionContainerProps
> = () => {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentIndex, setCurrentIndex] = useState(0);
  const [connected, setConnected] = useState(true);
  const [positions, setPositions] = useState<PoolPosition[]>([]);

  useEffect(() => {
    const dummyPositions = dummyPositionList();
    setPositions(dummyPositions);
  }, []);

  const connect = useCallback(() => {
    setConnected(true);
  }, []);

  const moveEarnAdd = useCallback(() => {
    router.push("/earn/add");
  }, [router]);

  const movePoolDetail = useCallback((id: string) => {
    router.push(`/earn/pool/${id}`);
  }, [router]);

  return (
    <EarnMyPositions
      connected={connected}
      connect={connect}
      fetched={true}
      positions={positions}
      moveEarnAdd={moveEarnAdd}
      movePoolDetail={movePoolDetail}
    />
  );
};

export default EarnMyPositionContainer;
