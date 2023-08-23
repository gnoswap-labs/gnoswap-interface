import React, { useCallback, useState } from "react";
import SwapCard from "@components/swap/swap-card/SwapCard";
import { useQuery } from "@tanstack/react-query";
import { useWindowSize } from "@hooks/common/use-window-size";

export interface SwapGasInfo {
  priceImpact: string;
  minReceived: string;
  gasFee: string;
  usdExchangeGasFee: string;
}
interface TokenInfo {
  token: string;
  symbol: string;
  amount: string;
  price: string;
  gnosExchangePrice: string;
  usdExchangePrice: string;
  balance: string;
  tokenLogo: string;
}

export const dummySwapGasInfo: SwapGasInfo = {
  priceImpact: "-0.3%",
  minReceived: "1.8445 ETH",
  gasFee: "0.002451 GNOT",
  usdExchangeGasFee: "$0.12",
};

export interface AutoRouterInfo {
  v1fee: string[];
  v2fee: string[];
  v3fee: string[];
}

export const dummyAutoRouterInfo: AutoRouterInfo = {
  v1fee: ["60%", "0.05%", "0.01%"],
  v2fee: ["35%", "0.01%"],
  v3fee: ["5%", "0.3%"],
};

export interface tokenInfo {
  [key: string]: string;
}

export const coinList = (): tokenInfo[] => [
  {
    logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
    name: "Bitcoin",
    symbol: "BTC",
    balance: "0.112",
  },
  {
    logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/2.png",
    name: "Ethereum",
    symbol: "ETH",
    balance: "7.21",
  },
  {
    logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/3.png",
    name: "Gnoland",
    symbol: "GNOT",
    balance: "109.1",
  },
  {
    logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/3.png",
    name: "Gnoland2",
    symbol: "GNOS",
    balance: "1019.1",
  },
  {
    logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/3.png",
    name: "Gnoland3",
    symbol: "GNOQ",
    balance: "109444.1",
  },
  {
    logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/3.png",
    name: "Gnoland4",
    symbol: "GNOV",
    balance: "1094244.1",
  },
];

async function fetchTokens(
  keyword: string, // eslint-disable-line
): Promise<tokenInfo[]> {
  return new Promise(resolve => setTimeout(resolve, 500)).then(() =>
    Promise.resolve([...coinList()]),
  );
}

function isAmount(str: string) {
  const regex = /^\d+(\.\d*)?$/;
  return regex.test(str);
}

export interface SwapData {
  success: boolean;
  transaction?: string;
}

async function fetchSwap(): Promise<SwapData> {
  return new Promise(resolve => setTimeout(resolve, 4000)).then(() =>
    Promise.resolve({
      success: true,
      transaction: "https://gnoscan.io/",
    }),
  );
}

const SwapContainer: React.FC = () => {
  const { breakpoint } = useWindowSize();
  const [keyword, setKeyword] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [gnosAmount, setGnosAmount] = useState("1500");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isConnected, setIsConnected] = useState(true);
  const [autoRouter, setAutoRouter] = useState(false);
  const [swapInfo, setSwapInfo] = useState(false);
  const [settingMenuToggle, setSettingMenuToggle] = useState(false);
  const [tolerance, setTolerance] = useState("10");
  const [tokenModal, setMokenModal] = useState(false);
  const [swapOpen, setSwapOpen] = useState(false);
  const [division, setDivision] = useState("");
  const [submit, setSubmit] = useState(false);

  const { data: tokens } = useQuery<tokenInfo[], Error>({
    queryKey: [keyword],
    queryFn: () => fetchTokens(keyword),
  });

  const { isFetched, data: swapResult } = useQuery<SwapData, Error>({
    queryKey: [],
    queryFn: () => fetchSwap(),
  });

  //   eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [from, setFrom] = useState<TokenInfo>({
    token: "USDCoin",
    symbol: "USDC",
    amount: "121",
    price: "$0.00",
    gnosExchangePrice: "1250",
    usdExchangePrice: "($1541.55)",
    balance: "0",
    tokenLogo:
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [to, setTo] = useState<TokenInfo>({
    token: "HEX",
    symbol: "HEX",
    amount: "5000",
    price: "$0.00",
    gnosExchangePrice: "1250",
    usdExchangePrice: "($1541.55)",
    balance: "0",
    tokenLogo:
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
  });

  const changeToken = (token: tokenInfo) => {
    switch (division) {
      case "from":
        setFrom(prev => ({
          ...prev,
          tokenLogo: token.logo,
          token: token.name,
          symbol: token.symbol,
          balance: token.balance,
        }));
        break;
      case "to":
        setTo(prev => ({
          ...prev,
          tokenLogo: token.logo,
          token: token.name,
          symbol: token.symbol,
          balance: token.balance,
        }));
        break;
    }
  };

  const onSettingMenu = () => {
    setSettingMenuToggle(prev => !prev);
  };

  const onSelectTokenModal = () => {
    document.body.style.overflowY = tokenModal ? "auto" : "hidden";
    setMokenModal(prev => !prev);
  };

  const onConfirmModal = () => {
    setSwapOpen(prev => !prev);
  };

  const changeTolerance = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value !== "" && !isAmount(value)) return;
    setTolerance(value);
  };

  const selectToken = (e: string) => {
    setDivision(e);
  };

  const search = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  }, []);

  const showSwapInfo = () => {
    setSwapInfo(prev => !prev);
  };

  const showAutoRouter = () => {
    setAutoRouter(prev => !prev);
  };

  const submitSwap = () => {
    setSubmit(prev => !prev);
  };

  return (
    <SwapCard
      search={search}
      keyword={keyword}
      isConnected={isConnected}
      swapInfo={swapInfo}
      showSwapInfo={showSwapInfo}
      gnosAmount={gnosAmount}
      autoRouter={autoRouter}
      showAutoRouter={showAutoRouter}
      swapGasInfo={dummySwapGasInfo}
      autoRouterInfo={dummyAutoRouterInfo}
      settingMenuToggle={settingMenuToggle}
      onSettingMenu={onSettingMenu}
      tolerance={tolerance}
      changeTolerance={changeTolerance}
      tokenModal={tokenModal}
      onSelectTokenModal={onSelectTokenModal}
      swapOpen={swapOpen}
      onConfirmModal={onConfirmModal}
      coinList={tokens ?? []}
      from={from}
      to={to}
      changeToken={changeToken}
      selectToken={selectToken}
      submitSwap={submitSwap}
      breakpoint={breakpoint}
      submit={submit}
      isFetched={isFetched}
      swapResult={swapResult}
    />
  );
};

export default SwapContainer;
