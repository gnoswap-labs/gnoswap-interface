import React, { useCallback, useEffect, useMemo, useState } from "react";
import SelectToken from "@components/common/select-token/SelectToken";
import { useClearModal } from "@hooks/common/use-clear-modal";
import { TokenInfo } from "@models/token/token-info";
import { useTokenData } from "@hooks/token/use-token-data";
import { TokenModel } from "@models/token/token-model";

interface SelectTokenContainerProps {
  changeToken?: (token: TokenInfo) => void;
}

const SelectTokenContainer: React.FC<SelectTokenContainerProps> = ({
  changeToken,
}) => {
  const { tokens, balances, updateTokens, updateBalances } = useTokenData();
  const [keyword, setKeyword] = useState("");
  const clearModal = useClearModal();

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
      token.symbol.toLowerCase().includes(lowerKeyword)
    );
  }, [keyword, tokens]);

  const selectToken = useCallback((token: TokenModel) => {
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
      tokenPrices={balances}
      changeKeyword={changeKeyword}
      changeToken={selectToken}
      close={close}
    />
  );
};

export default SelectTokenContainer;