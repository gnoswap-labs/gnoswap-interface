import BigNumber from "bignumber.js";
import { useAtomValue } from "jotai";
import React, { useCallback, useMemo, useState } from "react";

import { GNOT_TOKEN, GNS_TOKEN } from "@common/values/token-constant";
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
import { ORDER, customSort } from "@utils/token-sort";

interface SelectTokenContainerProps {
  changeToken?: (token: TokenModel) => void;
  callback?: (value: boolean) => void;
  additionalTokens?: TokenModel[];
}

export interface SortedProps extends TokenModel {
  price: string;
  tokenPrice: number;
}

const EMPTY_ADDITIONAL_TOKENS: TokenModel[] = [];

export { ORDER, customSort };

const handleSort = (list: SortedProps[]) => {
  const gnot = list.find(a => a.path === GNOT_TOKEN.path);
  const gns = list.find(a => a.path === GNS_TOKEN.path);
  const valueOfBalance = list
    .filter(a => a.price !== "-" && a.path !== GNOT_TOKEN.path && a.path !== GNS_TOKEN.path)
    .sort((a, b) => {
      const priceA = parseFloat(a.price.replace(/,/g, ""));
      const priceB = parseFloat(b.price.replace(/,/g, ""));
      return priceB - priceA;
    });
  const amountOfBalance = list
    .filter(
      a =>
        a.price !== "-" &&
        a.path !== GNOT_TOKEN.path &&
        a.path !== GNS_TOKEN.path &&
        !valueOfBalance.includes(a) &&
        a.tokenPrice > 0,
    )
    .sort((a, b) => b.tokenPrice - a.tokenPrice);
  const alphabest = list
    .filter(
      a =>
        !amountOfBalance.includes(a) &&
        a.path !== GNOT_TOKEN.path &&
        a.path !== GNS_TOKEN.path &&
        !valueOfBalance.includes(a),
    )
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  const rs = [];
  if (gnot) rs.push(gnot);
  if (gns) rs.push(gns);
  return [...rs, ...valueOfBalance, ...amountOfBalance, ...alphabest];
};

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
    const temp: SortedProps[] = availableTokens.map((item: TokenModel) => {
      const tokenBalance = displayBalanceStringMap[item.path] ?? displayBalanceStringMap[item.priceID];
      const balance = BigNumber(tokenBalance ?? "");
      if (!tokenBalance || balance.isNaN() || balance.isLessThanOrEqualTo(0)) {
        return {
          price: "-",
          ...item,
          tokenPrice: balance.isNaN() ? 0 : balance.toNumber(),
        };
      }
      return {
        ...item,
        price: balance.multipliedBy(tokenPrices[item.priceID]?.usd || "0").toFormat(),
        tokenPrice: balance.toNumber(),
      };
    });
    const sortedData = handleSort(temp);
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
