import BigNumber from "bignumber.js";
import { useAtom, useAtomValue } from "jotai";
import { useRouter } from "next/router";
import React, { useCallback, useMemo, useState } from "react";

import { GNOT_TOKEN, GNS_TOKEN } from "@common/values/token-constant";
import SelectToken from "@components/common/select-token/SelectToken";
import { useClearModal } from "@hooks/common/use-clear-modal";
import useEscCloseModal from "@hooks/common/use-esc-close-modal";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useTokenTradingModal } from "@hooks/swap/use-token-trading-modal";
import { useTokenData } from "@hooks/token/use-token-data";
import { useWallet } from "@hooks/wallet/use-wallet";
import { TokenModel } from "@models/token/token-model";
import { ThemeState, TokenState } from "@states/index";
import { parseJson } from "@utils/common";

interface SelectTokenContainerProps {
  changeToken?: (token: TokenModel) => void;
  callback?: (value: boolean) => void;
  modalRef?: React.RefObject<HTMLDivElement>;
}

export interface SortedProps extends TokenModel {
  price: string;
  tokenPrice: number;
}

export const ORDER = [GNOT_TOKEN.symbol, GNS_TOKEN.symbol, "BAR", "BAZ"];

export const customSort = (a: TokenModel, b: TokenModel) => {
  const symbolA = a.symbol.toUpperCase();
  const symbolB = b.symbol.toUpperCase();

  const indexA = ORDER.indexOf(symbolA);
  const indexB = ORDER.indexOf(symbolB);

  if (indexA === -1) return 1;
  if (indexB === -1) return -1;

  return indexA - indexB;
};


const handleSort = (list: SortedProps[]) => {
  const gnot = list.find(a => a.path === GNOT_TOKEN.path);
  const gns = list.find(a => a.path === GNS_TOKEN.path);
  const valueOfBalance = list
    .filter(
      a =>
        a.price !== "-" &&
        a.path !== GNOT_TOKEN.path &&
        a.path !== GNS_TOKEN.path,
    )
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
  modalRef,
}) => {
  const router = useRouter();
  const { breakpoint } = useWindowSize();
  const {
    tokens,
    balances,
    tokenPrices,
    displayBalanceMap,
  } = useTokenData();
  const [keyword, setKeyword] = useState("");
  const clearModal = useClearModal();
  const themeKey = useAtomValue(ThemeState.themeKey);
  const [, setFromSelectToken] = useAtom(TokenState.fromSelectToken);
  const recentsData = useAtomValue(TokenState.selectRecents);
  const { isSwitchNetwork } = useWallet();

  const recents = useMemo(() => {
    return parseJson(recentsData ? recentsData : "[]");
  }, [recentsData]);

  const { openModal: openTradingModal } = useTokenTradingModal({
    onClickConfirm: (value: TokenModel) => {
      setFromSelectToken(true);
      changeToken?.(value);
      close();
    },
    onClickClose: () => {
      router.push("/");
    }
  });

  const defaultTokens = useMemo(() => {
    const temp = tokens;
    const sortedTokenList = temp.sort(customSort);
    return sortedTokenList.slice(0, 4);
  }, [tokens]);

  const filteredTokens = useMemo(() => {
    const lowerKeyword = keyword.toLowerCase();
    const temp: SortedProps[] = tokens.map((item: TokenModel) => {
      const tokenPrice = balances[item.priceID];
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

  const close = useCallback(() => {
    clearModal();
    callback?.(true);
  }, [clearModal, callback]);

  const selectToken = useCallback(
    (token: TokenModel) => {
      if (!changeToken) {
        return;
      }
      if (token.path) {
        changeToken(token);
        close();
      } else {
        openTradingModal(token);
      }
    },
    [changeToken, close, openTradingModal],
  );

  const changeKeyword = useCallback((keyword: string) => {
    setKeyword(keyword);
  }, []);



  useEscCloseModal(close);

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
      isSwitchNetwork={isSwitchNetwork}
    />
  );
};

export default SelectTokenContainer;
