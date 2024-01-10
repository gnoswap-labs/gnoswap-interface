import React, { useCallback, useEffect, useMemo, useState } from "react";
import SelectToken from "@components/common/select-token/SelectToken";
import { useClearModal } from "@hooks/common/use-clear-modal";
import { useTokenData } from "@hooks/token/use-token-data";
import { TokenModel } from "@models/token/token-model";
import { useAtomValue, useAtom } from "jotai";
import { ThemeState, TokenState } from "@states/index";
import useEscCloseModal from "@hooks/common/use-esc-close-modal";
import { useTokenTradingModal } from "@hooks/swap/use-token-trading-modal";
import { useWindowSize } from "@hooks/common/use-window-size";
import BigNumber from "bignumber.js";
import { parseJson } from "@utils/common";
import { GNOT_SYMBOL, GNS_SYMBOL } from "@common/values/token-constant";

interface SelectTokenContainerProps {
  changeToken?: (token: TokenModel) => void;
  callback?: (value: boolean) => void;
  modalRef?: React.RefObject<HTMLDivElement>;
}

export interface SortedProps extends TokenModel {
  price: string;
  tokenPrice: number;
}

export const ORDER = [GNOT_SYMBOL, GNS_SYMBOL, "BAR", "BAZ"];

const customSort = (a: TokenModel, b: TokenModel) => {
  const symbolA = a.symbol.toUpperCase();
  const symbolB = b.symbol.toUpperCase();

  const indexA = ORDER.indexOf(symbolA);
  const indexB = ORDER.indexOf(symbolB);

  if (indexA === -1) return 1;
  if (indexB === -1) return -1;

  return indexA - indexB;
};


const handleSort = (list: SortedProps[]) => {
  const gnot = list.find(a => a.symbol === GNOT_SYMBOL);
  const gnos = list.find(a => a.symbol === GNS_SYMBOL);
  const valueOfBalance = list.filter(a => a.price !== "-" && a.symbol !== GNOT_SYMBOL && a.symbol !== GNS_SYMBOL).sort((a, b) => {
    const priceA = parseFloat(a.price.replace(/,/g, ""));
    const priceB = parseFloat(b.price.replace(/,/g, ""));
    return priceB - priceA;
  });
  const amountOfBalance = list.filter(a => a.price !== "-" && a.symbol !== GNOT_SYMBOL && a.symbol !== GNS_SYMBOL && !valueOfBalance.includes(a) && a.tokenPrice > 0).sort((a,b) => b.tokenPrice - a.tokenPrice);
  const alphabest = list.filter(a => !amountOfBalance.includes(a) && a.symbol !== GNOT_SYMBOL && a.symbol !== GNS_SYMBOL && !valueOfBalance.includes(a)).sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  const rs = [];
  gnot && rs.push(gnot);
  gnos && rs.push(gnos);
  return [...rs, ...valueOfBalance, ...amountOfBalance, ...alphabest];
};

const SelectTokenContainer: React.FC<SelectTokenContainerProps> = ({
  changeToken,
  callback,
  modalRef,
}) => {
  const { breakpoint } = useWindowSize();
  const {
    tokens,
    balances,
    updateTokens,
    updateBalances,
    tokenPrices,
    displayBalanceMap,
  } = useTokenData();
  const [keyword, setKeyword] = useState("");
  const clearModal = useClearModal();
  const themeKey = useAtomValue(ThemeState.themeKey);
  const [, setFromSelectToken] = useAtom(TokenState.fromSelectToken);
  const recentsData = useAtomValue(TokenState.selectRecents);

  const recents = useMemo(() => {
    return parseJson(recentsData ? recentsData : "[]");
  }, [recentsData]);

  const { openModal: openTradingModal } = useTokenTradingModal({
    onClickConfirm: (value: any) => {
      setFromSelectToken(true);
      changeToken?.(value);
      close();
    },
  });

  useEffect(() => {
    updateTokens();
  }, []);

  useEffect(() => {
    if (tokens.length > 0) updateBalances();
  }, [tokens]);

  const defaultTokens = useMemo(() => {
    const temp = tokens;
    const sortedTokenList = temp.sort(customSort);
    return sortedTokenList.slice(0, 4);
  }, [tokens]);

  const filteredTokens = useMemo(() => {
    const lowerKeyword = keyword.toLowerCase();
    const temp: SortedProps[] = tokens.map((item: TokenModel) => {
      const tokenPrice = balances[item.priceId];
      if (!tokenPrice || tokenPrice === null || Number.isNaN(tokenPrice)) {
        return {
          price: "-",
          ...item,
          tokenPrice: tokenPrice || 0,
        };
      }
      return {
        ...item,
        price: BigNumber(tokenPrice)
          .multipliedBy(tokenPrices[item?.path]?.usd || "0")
          .toFormat(),
        tokenPrice: tokenPrice || 0,
      };
    });
    const sortedData = handleSort(temp);
    return sortedData.filter(
      token =>
        token.name.toLowerCase().includes(lowerKeyword) ||
        token.symbol.toLowerCase().includes(lowerKeyword) ||
        token.path.toLowerCase().includes(lowerKeyword),
    );
  }, [keyword, tokens, balances, tokenPrices]);
  
  const selectToken = useCallback(
    (token: TokenModel) => {
      if (!changeToken) {
        return;
      }
      if (token.logoURI) {
        changeToken(token);
        close();
      } else {
        openTradingModal(token);
      }
    },
    [changeToken, openTradingModal],
  );

  const changeKeyword = useCallback((keyword: string) => {
    setKeyword(keyword);
  }, []);

  const close = useCallback(() => {
    clearModal();
    callback?.(true);
  }, [clearModal, callback]);

  useEscCloseModal(close);

  useEffect(() => {
    updateTokens();
  }, []);

  useEffect(() => {
    if (tokens.length > 0) updateBalances();
  }, [tokens]);

  return (
    <SelectToken
      keyword={keyword}
      defaultTokens={defaultTokens}
      tokens={filteredTokens}
      tokenPrices={displayBalanceMap}
      changeKeyword={changeKeyword}
      changeToken={selectToken}
      close={close}
      themeKey={themeKey}
      modalRef={modalRef}
      breakpoint={breakpoint}
      recents={recents}
    />
  );
};

export default SelectTokenContainer;
