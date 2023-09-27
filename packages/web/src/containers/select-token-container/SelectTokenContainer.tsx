import React, { useCallback, useEffect, useMemo, useState } from "react";
import SelectToken from "@components/common/select-token/SelectToken";
import { useClearModal } from "@hooks/common/use-clear-modal";
import { TokenInfo } from "@models/token/token-info";

const dummyTokens = [
  {
    path: "1",
    logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
    name: "Bitcoin",
    symbol: "BTC",
  },
  {
    path: "2",
    logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/2.png",
    name: "Ethereum",
    symbol: "ETH",
  },
  {
    path: "3",
    logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/3.png",
    name: "Gnoland",
    symbol: "GNOT",
  },
  {
    path: "4",
    logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/3.png",
    name: "Gnoland2",
    symbol: "GNOS",
  },
  {
    path: "5",
    logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/3.png",
    name: "Gnoland3",
    symbol: "GNOQ",
  },
  {
    path: "6",
    logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/3.png",
    name: "Gnoland4",
    symbol: "GNOV",
  },
];

const dummyTokenPrices = [
  {
    path: "1",
    price: "0.112",
  },
  {
    path: "2",
    price: "7.21",
  },
  {
    path: "3",
    price: "109.1",
  },
  {
    path: "4",
    price: "1019.1",
  },
  {
    path: "5",
    price: "109444.1",
  },
  {
    path: "6",
    price: "1094244.1",
  },
];

interface SelectTokenContainerProps {
  changeToken?: (token: TokenInfo) => void;
}

const SelectTokenContainer: React.FC<SelectTokenContainerProps> = ({
  changeToken,
}) => {
  const [keyword, setKeyword] = useState("");
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [tokenPrices, setTokenPrices] = useState<{ path: string; price: string }[]>([]);
  const clearModal = useClearModal();

  useEffect(() => {
    fetchTokens();
    fetchTokenPrices();
  }, []);

  const defaultTokens = useMemo(() => {
    return tokens.filter((_, index) => index < 5);
  }, [tokens]);

  const filteredTokens = useMemo(() => {
    const lowerKeyword = keyword.toLowerCase();
    return tokens.filter(token =>
      token.name.toLowerCase().includes(lowerKeyword) ||
      token.symbol.toLowerCase().includes(lowerKeyword)
    );
  }, [keyword, tokens]);

  function fetchTokens() {
    setTokens(dummyTokens);
  }

  function fetchTokenPrices() {
    setTokenPrices(dummyTokenPrices);
  }

  const selectToken = useCallback((token: TokenInfo) => {
    if (!changeToken) {
      return;
    }
    changeToken(token);
  }, [changeToken]);

  const changeKeyword = useCallback((keyword: string) => {
    setKeyword(keyword);
  }, []);

  const close = useCallback(() => {
    clearModal();
  }, [clearModal]);

  return (
    <SelectToken
      keyword={keyword}
      defaultTokens={defaultTokens}
      tokens={filteredTokens}
      tokenPrices={tokenPrices}
      changeKeyword={changeKeyword}
      changeToken={selectToken}
      close={close}
    />
  );
};

export default SelectTokenContainer;