import React, { useCallback, useEffect, useMemo, useState } from "react";
import SelectToken from "@components/common/select-token/SelectToken";
import { useClearModal } from "@hooks/common/use-clear-modal";
import { useTokenData } from "@hooks/token/use-token-data";
import { TokenModel } from "@models/token/token-model";
import { useAtomValue, useAtom } from "jotai";
import { ThemeState, TokenState } from "@states/index";
import useEscCloseModal from "@hooks/common/use-esc-close-modal";
import { useTokenTradingModal } from "@hooks/swap/use-token-trading-modal";

interface SelectTokenContainerProps {
  changeToken?: (token: TokenModel) => void;
  callback?: (value: boolean) => void;
  modalRef?: React.RefObject<HTMLDivElement>;
}
const ORDER = ["GNOT", "GNS", "BAR", "FOO", "BAZ", "QUX"];

const customSort = (a: TokenModel, b: TokenModel) => {
  const symbolA = a.symbol.toUpperCase();
  const symbolB = b.symbol.toUpperCase();

  const indexA = ORDER.indexOf(symbolA);
  const indexB = ORDER.indexOf(symbolB);

  if (indexA === -1) return 1;
  if (indexB === -1) return -1;

  return indexA - indexB;
};

const SelectTokenContainer: React.FC<SelectTokenContainerProps> = ({
  changeToken,
  callback,
  modalRef,
}) => {
  const { tokens, balances, updateTokens, updateBalances } = useTokenData();
  const [keyword, setKeyword] = useState("");
  const clearModal = useClearModal();
  const themeKey = useAtomValue(ThemeState.themeKey);
  const [, setFromSelectToken] = useAtom(TokenState.fromSelectToken);

  const { openModal: openTradingModal } = useTokenTradingModal({
    onClickConfirm: (value: any) => {
      setFromSelectToken(true);
      changeToken?.(value);
      close();
    }
  });
  
  useEffect(() => {
    updateTokens();
  }, []);

  useEffect(() => {
    if (tokens.length > 0)
      updateBalances();
  }, [tokens]);

  const defaultTokens = useMemo(() => {
    const temp = tokens.filter((_) => !!_.logoURI);
    const sortedTokenList = temp.sort(customSort);
    return sortedTokenList;
  }, [tokens]);
  console.log(defaultTokens);
  
  const filteredTokens = useMemo(() => {
    const lowerKeyword = keyword.toLowerCase();
    return tokens.filter(token =>
      token.name.toLowerCase().includes(lowerKeyword) ||
      token.symbol.toLowerCase().includes(lowerKeyword) ||
      token.path.toLowerCase().includes(lowerKeyword)
    );
  }, [keyword, tokens]);

  const selectToken = useCallback((token: TokenModel) => {
    if (!changeToken) {
      return;
    }
    if (token.logoURI) {
      changeToken(token);
      close();
    } else {
      openTradingModal(token);
    }
  }, [changeToken, openTradingModal]);

  const changeKeyword = useCallback((keyword: string) => {
    setKeyword(keyword);
  }, []);

  const close = useCallback(() => {
    clearModal();
    callback?.(true);
  }, [clearModal, callback]);

  useEscCloseModal(close);

  return (
    <SelectToken
      keyword={keyword}
      defaultTokens={defaultTokens}
      tokens={filteredTokens}
      tokenPrices={balances}
      changeKeyword={changeKeyword}
      changeToken={selectToken}
      close={close}
      themeKey={themeKey}
      modalRef={modalRef}
    />
  );
};

export default SelectTokenContainer;