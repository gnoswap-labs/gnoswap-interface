import React, { useCallback, useEffect, useMemo, useState } from "react";
import SelectToken from "@components/common/select-token/SelectToken";
import { useClearModal } from "@hooks/common/use-clear-modal";
import { TokenDefaultModel } from "@models/token/token-default-model";

const dummyTokens = [
  {
    tokenId: "1",
    tokenLogo: "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
    name: "Bitcoin",
    symbol: "BTC",
  },
  {
    tokenId: "2",
    tokenLogo: "https://s2.coinmarketcap.com/static/img/coins/64x64/2.png",
    name: "Ethereum",
    symbol: "ETH",
  },
  {
    tokenId: "3",
    tokenLogo: "https://s2.coinmarketcap.com/static/img/coins/64x64/3.png",
    name: "Gnoland",
    symbol: "GNOT",
  },
  {
    tokenId: "4",
    tokenLogo: "https://s2.coinmarketcap.com/static/img/coins/64x64/3.png",
    name: "Gnoland2",
    symbol: "GNOS",
  },
  {
    tokenId: "5",
    tokenLogo: "https://s2.coinmarketcap.com/static/img/coins/64x64/3.png",
    name: "Gnoland3",
    symbol: "GNOQ",
  },
  {
    tokenId: "6",
    tokenLogo: "https://s2.coinmarketcap.com/static/img/coins/64x64/3.png",
    name: "Gnoland4",
    symbol: "GNOV",
  },
];

const dummyTokenPrices = [
  {
    tokenId: "1",
    price: "0.112",
  },
  {
    tokenId: "2",
    price: "7.21",
  },
  {
    tokenId: "3",
    price: "109.1",
  },
  {
    tokenId: "4",
    price: "1019.1",
  },
  {
    tokenId: "5",
    price: "109444.1",
  },
  {
    tokenId: "6",
    price: "1094244.1",
  },
];

interface SelectTokenContainerProps {
  changeToken?: (token: TokenDefaultModel) => void;
}

const SelectTokenContainer: React.FC<SelectTokenContainerProps> = ({
  changeToken,
}) => {
  const [keyword, setKeyword] = useState("");
  const [tokens, setTokens] = useState<TokenDefaultModel[]>([]);
  const [tokenPrices, setTokenPrices] = useState<{ tokenId: string; price: string }[]>([]);
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

  const selectToken = useCallback((token: TokenDefaultModel) => {
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