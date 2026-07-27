import React, { useCallback, useEffect, useMemo, useState } from "react";
import SelectToken from "@components/common/select-token-incentivize/SelectTokenIncentivize";
import { useClearModal } from "@hooks/common/use-clear-modal";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { TokenModel } from "@models/token/token-model";
import { useAtomValue } from "jotai";
import { ThemeState } from "@states/index";
import useEscCloseModal from "@hooks/common/use-esc-close-modal";
import { useGetAllowedExternalRewardTokenPaths } from "@query/pools";
import { filterAllowedIncentiveTokens, incentiveTokenPath } from "./incentive-token-filter";

interface SelectTokenIncentivizeContainerProps {
  changeToken?: (token: TokenModel) => void;
  callback?: (value: boolean) => void;
  poolTokens?: readonly TokenModel[];
}
const SelectTokenIncentivizeContainer: React.FC<SelectTokenIncentivizeContainerProps> = ({
  changeToken,
  callback,
  poolTokens,
}) => {
  const { tokens, balances, updateTokens, updateBalances } = useTokenData();
  const { data: allowedTokenPaths = [] } = useGetAllowedExternalRewardTokenPaths();
  const [keyword, setKeyword] = useState("");
  const clearModal = useClearModal();
  const themeKey = useAtomValue(ThemeState.themeKey);

  useEffect(() => {
    updateTokens();
  }, []);

  useEffect(() => {
    if (tokens.length > 0) updateBalances();
  }, [tokens]);

  const combinedAllowedTokenPaths = useMemo(() => {
    const poolTokenPaths = (poolTokens ?? []).map(incentiveTokenPath);
    return [...allowedTokenPaths, ...poolTokenPaths];
  }, [allowedTokenPaths, poolTokens]);

  const defaultTokens = useMemo(() => {
    return filterAllowedIncentiveTokens(tokens, combinedAllowedTokenPaths).filter((_, index) => index < 5);
  }, [combinedAllowedTokenPaths, tokens]);

  const filteredTokens = useMemo(() => {
    return filterAllowedIncentiveTokens(tokens, combinedAllowedTokenPaths);
  }, [combinedAllowedTokenPaths, tokens]);

  const selectToken = useCallback(
    (token: TokenModel) => {
      if (!changeToken) {
        return;
      }
      changeToken(token);
    },
    [changeToken],
  );

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
