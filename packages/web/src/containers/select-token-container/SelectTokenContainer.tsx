import React, { useCallback, useEffect, useMemo, useState } from "react";
import SelectToken from "@components/common/select-token/SelectToken";
import { useClearModal } from "@hooks/common/use-clear-modal";
import { useTokenData } from "@hooks/token/use-token-data";
import { TokenModel } from "@models/token/token-model";
import { useAtomValue } from "jotai";
import { ThemeState } from "@states/index";
import useEscCloseModal from "@hooks/common/use-esc-close-modal";
import { useTokenTradingModal } from "@hooks/swap/use-token-trading-modal";

interface SelectTokenContainerProps {
  changeToken?: (token: TokenModel) => void;
  callback?: (value: boolean) => void;
  modalRef?: React.RefObject<HTMLDivElement>;
}

const SelectTokenContainer: React.FC<SelectTokenContainerProps> = ({
  changeToken,
  callback,
  modalRef,
}) => {
  const { tokens, balances, updateTokens, updateBalances } = useTokenData();
  const [keyword, setKeyword] = useState("");
  const clearModal = useClearModal();
  const themeKey = useAtomValue(ThemeState.themeKey);
  const { openModal: openTradingModal } = useTokenTradingModal({
    onClickConfirm: (value) => {
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
    return tokens.filter((_, index) => index < 5);
  }, [tokens]);

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
    const temp = Math.floor(Math.random() * 2);
    if (temp === 1) {
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