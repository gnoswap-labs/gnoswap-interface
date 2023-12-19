import React, { useCallback, useEffect, useMemo, useState } from "react";
import SelectToken from "@components/common/select-token-incentivize/SelectTokenIncentivize";
import { useClearModal } from "@hooks/common/use-clear-modal";
import { useTokenData } from "@hooks/token/use-token-data";
import { TokenModel } from "@models/token/token-model";
import { useAtomValue } from "jotai";
import { ThemeState } from "@states/index";
import useEscCloseModal from "@hooks/common/use-esc-close-modal";
import { ORDER } from "@containers/select-token-container/SelectTokenContainer";
import { useRouter } from "next/router";
import { encriptId } from "@utils/common";

interface SelectTokenIncentivizeContainerProps {
  changeToken?: (token: TokenModel) => void;
  callback?: (value: boolean) => void;
}
const customSort = (a: TokenModel, b: TokenModel) => {
  const symbolA = a.symbol.toUpperCase();
  const symbolB = b.symbol.toUpperCase();

  const indexA = ORDER.slice(0, 2).indexOf(symbolA);
  const indexB = ORDER.slice(0, 2).indexOf(symbolB);

  if (indexA === -1) return 1;
  if (indexB === -1) return -1;

  return indexA - indexB;
};
const SelectTokenIncentivizeContainer: React.FC<SelectTokenIncentivizeContainerProps> = ({
  changeToken,
  callback,
}) => {
  const { tokens, balances, updateTokens, updateBalances } = useTokenData();
  const [keyword, setKeyword] = useState("");
  const clearModal = useClearModal();
  const themeKey = useAtomValue(ThemeState.themeKey);
  const router = useRouter();
  const poolPath = router.query["pool-path"];
  const currentPath = encriptId(poolPath as string);
  
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
    const temp = tokens.sort(customSort);
    const splitPath: string[] = currentPath?.split(":") || [];
    const token1 = tokens.filter(item => item.path === splitPath[0] && !item.symbol.includes("GNOT") && item.symbol !== "GNS");
    const token2 = tokens.filter(item => item.path === splitPath[1] && !item.symbol.includes("GNOT") && item.symbol !== "GNS");
    return [...temp.slice(0, 2), ...token1, ...token2];
  }, [tokens, currentPath]);

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
    />
  );
};

export default SelectTokenIncentivizeContainer;