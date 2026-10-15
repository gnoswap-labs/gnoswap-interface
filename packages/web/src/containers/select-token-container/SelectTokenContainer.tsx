import BigNumber from "bignumber.js";
import { useAtomValue } from "jotai";
import React, { useCallback, useMemo, useState } from "react";

import SelectToken from "@components/common/select-token/SelectToken";
import { useClearModal } from "@hooks/common/use-clear-modal";
import useEscCloseModal from "@hooks/common/use-esc-close-modal";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { useTokenWarningModal } from "@hooks/token/ui/use-token-warning-modal";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { TokenModel } from "@models/token/token-model";
import { ThemeState, TokenState } from "@states/index";
import { parseJson } from "@utils/common";
import { ORDER, SelectTokenSortable, compareSelectTokens, customSort } from "@utils/token-sort";

interface SelectTokenContainerProps {
  changeToken?: (token: TokenModel) => void;
  callback?: (value: boolean) => void;
  additionalTokens?: TokenModel[];
}

const EMPTY_ADDITIONAL_TOKENS: TokenModel[] = [];

export { ORDER, customSort };

const SelectTokenContainer: React.FC<SelectTokenContainerProps> = ({
  changeToken,
  callback,
  additionalTokens = EMPTY_ADDITIONAL_TOKENS,
}) => {
  const { breakpoint } = useWindowSize();
  const { tokens, tokenPrices, displayBalanceStringMap } = useTokenData(true);
  const [keyword, setKeyword] = useState("");
  const clearModal = useClearModal();
  const themeKey = useAtomValue(ThemeState.themeKey);
  const recentsData = useAtomValue(TokenState.selectRecents);
  const { isSwitchNetwork } = useWallet();
  const availableTokens = useMemo(() => {
    const tokenPaths = new Set(tokens.map(token => token.path));
    return [...tokens, ...additionalTokens.filter(token => !tokenPaths.has(token.path))];
  }, [additionalTokens, tokens]);

  const recents = useMemo(() => {
    const recentTokens = parseJson(recentsData ? recentsData : "[]");
    return recentTokens.filter((recentToken: TokenModel) =>
      availableTokens.some(token => token.path === recentToken.path),
    );
  }, [availableTokens, recentsData]);

  const close = useCallback(() => {
    clearModal();
    callback?.(true);
  }, [clearModal, callback]);

  const { openModal: openWarningModal } = useTokenWarningModal({
    onClickConfirm: (value: TokenModel) => {
      changeToken?.(value);
      close();
    },
    onClickClose: () => {
      // just close
    },
  });

  useEscCloseModal(close);

  const defaultTokens = useMemo(() => {
    return [...availableTokens].sort(customSort).slice(0, 4);
  }, [availableTokens]);

  const filteredTokens = useMemo(() => {
    const lowerKeyword = keyword.toLowerCase();
    const temp: SelectTokenSortable[] = availableTokens.map((item: TokenModel) => {
      const tokenBalance = displayBalanceStringMap[item.path] ?? displayBalanceStringMap[item.priceID];
      const balance = BigNumber(tokenBalance ?? "");
      if (balance.isNaN() || balance.isLessThanOrEqualTo(0)) {
        return { ...item, usdValue: 0, balance: 0 };
      }
      const usdValue = balance.multipliedBy(tokenPrices[item.priceID]?.usd || "0").toNumber();
      return { ...item, usdValue: usdValue || 0, balance: balance.toNumber() };
    });
    const sortedData = temp.sort(compareSelectTokens);
    return sortedData.filter(
      token =>
        token.name.toLowerCase().includes(lowerKeyword) ||
        token.symbol.toLowerCase().includes(lowerKeyword) ||
        token.path.toLowerCase().includes(lowerKeyword),
    );
  }, [availableTokens, displayBalanceStringMap, keyword, tokenPrices]);

  const selectToken = useCallback(
    (token: TokenModel) => {
      if (!changeToken) {
        return;
      }
      if (token.path && token.logoURI) {
        changeToken(token);
        close();
      } else {
        openWarningModal(token);
      }
    },
    [changeToken, close, openWarningModal],
  );

  const changeKeyword = useCallback((keyword: string) => {
    setKeyword(keyword);
  }, []);

  return (
    <SelectToken
      keyword={keyword}
      defaultTokens={defaultTokens}
      tokens={filteredTokens}
      tokenPrices={displayBalanceStringMap}
      changeKeyword={changeKeyword}
      changeToken={selectToken}
      close={close}
      themeKey={themeKey}
      breakpoint={breakpoint}
      recents={recents}
      isSwitchNetwork={isSwitchNetwork}
    />
  );
};

export default SelectTokenContainer;
