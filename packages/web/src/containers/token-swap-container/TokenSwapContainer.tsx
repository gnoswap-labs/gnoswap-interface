import ConfirmSwapModal from "@components/swap/confirm-swap-modal/ConfirmSwapModal";
import TokenSwap from "@components/token/token-swap/TokenSwap";
import React, { useCallback, useState } from "react";
import { useAtomValue } from "jotai";
import { ThemeState } from "@states/index";
import SettingMenuModal from "@components/swap/setting-menu-modal/SettingMenuModal";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import { SwapSummaryInfo } from "@models/swap/swap-summary-info";

const swapSummaryInfo: SwapSummaryInfo = {
  tokenA: {
    chainId: "test3",
    address: "0x111111111117dC0aa78b770fA6A738034120C302",
    path: "gno.land/r/demo/1inch",
    name: "1inch",
    symbol: "1INCH",
    decimals: 6,
    logoURI:
      "https://assets.coingecko.com/coins/images/13469/thumb/1inch-token.png?1608803028",
    priceId: "1inch",
    createdAt: "1999-01-01T00:00:01Z",
  },
  tokenB: {
    chainId: "test3",
    address: "0x111111111117dC0aa78b770fA6A738034120C302",
    path: "gno.land/r/demo/1inch",
    name: "1inch",
    symbol: "1INCH",
    decimals: 6,
    logoURI:
      "https://assets.coingecko.com/coins/images/13469/thumb/1inch-token.png?1608803028",
    priceId: "1inch",
    createdAt: "1999-01-01T00:00:01Z",
  },
  swapDirection: "EXACT_IN",
  swapRate: 1.14,
  swapRateUSD: 1.14,
  priceImpact: 0.3,
  guaranteedAmount: {
    amount: 45124,
    currency: "GNOT",
  },
  gasFee: {
    amount: 0.000001,
    currency: "GNOT",
  },
  gasFeeUSD: 0.1,
};

const swapTokenInfo: SwapTokenInfo = {
  tokenA: {
    chainId: "test3",
    address: "0x111111111117dC0aa78b770fA6A738034120C302",
    path: "gno.land/r/demo/1inch",
    name: "1inch",
    symbol: "1INCH",
    decimals: 6,
    logoURI:
      "https://assets.coingecko.com/coins/images/13469/thumb/1inch-token.png?1608803028",
    priceId: "1inch",
    createdAt: "1999-01-01T00:00:01Z",
  },
  tokenAAmount: "0",
  tokenABalance: "0",
  tokenAUSD: 0,
  tokenAUSDStr: "0",
  tokenB: {
    chainId: "test3",
    address: "0x111111111117dC0aa78b770fA6A738034120C302",
    path: "gno.land/r/demo/1inch",
    name: "1inch",
    symbol: "1INCH",
    decimals: 6,
    logoURI:
      "https://assets.coingecko.com/coins/images/13469/thumb/1inch-token.png?1608803028",
    priceId: "1inch",
    createdAt: "1999-01-01T00:00:01Z",
  },
  tokenBAmount: "0",
  tokenBBalance: "0",
  tokenBUSD: 0,
  tokenBUSDStr: "0",
  direction: "EXACT_IN",
  slippage: 10,
};

const FROM_DATA = {
  token: {
    chainId: "dev",
    createdAt: "2023-10-10T08:48:46+09:00",
    name: "Gnoswap",
    address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
    path: "gno.land/r/gnos",
    decimals: 4,
    symbol: "GNOS",
    logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png",
    priceId: "gno.land/r/gnos",
  },
  amount: "0",
  price: "$0.00",
  balance: "0",
};

const TO_DATA = {
  token: {
    chainId: "dev",
    createdAt: "2023-10-10T08:48:46+09:00",
    name: "Gnoswap",
    address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
    path: "gno.land/r/gnos",
    decimals: 4,
    symbol: "GNOS",
    logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png",
    priceId: "gno.land/r/gnos",
  },
  amount: "0",
  price: "$0.00",
  balance: "0",
};

const TokenSwapContainer: React.FC = () => {
  const [toData, setToData] = useState(TO_DATA);
  const [fromData, setFromData] = useState(FROM_DATA);
  const [copied, setCopied] = useState(false);
  const [openedConfirmModal, setOpenedConfirmModal] = useState(false);
  const [openedSetting, setOpenedSetting] = useState(false);

  const themeKey = useAtomValue(ThemeState.themeKey);
  const swapNow = useCallback(() => {
    setOpenedConfirmModal(true);
  }, []);

  const connectWallet = useCallback(() => {
    console.log("Request Adena");
  }, []);

  const handleSwap = () => {
    setFromData(toData);
    setToData(fromData);
  };

  const handleCopied = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (e) {
      throw new Error("Copy Error!");
    }
  };

  const handleCloseSetting = () => {
    setOpenedSetting(false);
  };

  const handleSetting = () => {
    setOpenedSetting(true);
  };
  return (
    <>
      <TokenSwap
        from={fromData}
        to={toData}
        connected={true}
        connectWallet={connectWallet}
        swapNow={swapNow}
        handleSwap={handleSwap}
        copied={copied}
        handleCopied={handleCopied}
        themeKey={themeKey}
        handleSetting={handleSetting}
      />
      {openedConfirmModal && (
        <ConfirmSwapModal
          submitted={false}
          swapTokenInfo={swapTokenInfo}
          swapSummaryInfo={swapSummaryInfo}
          swapResult={null}
          swap={swapNow}
          close={() => setOpenedConfirmModal(false)}
        />
      )}
      {openedSetting && (
        <SettingMenuModal
          slippage={0}
          changeSlippage={() => {}}
          close={handleCloseSetting}
          className="swap-setting-class"
        />
      )}
    </>
  );
};

export default TokenSwapContainer;
