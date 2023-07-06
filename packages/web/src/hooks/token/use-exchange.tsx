import { metaInfoToConfig, toDefaultDenom } from "@common/utils/denom-util";
import { TokenDefaultModel } from "@models/token/token-default-model";
import { TokenPairModel } from "@models/token/token-pair-model";
import { useRepository } from "@hooks/repository/use-repository";
import { ExchangeRateMapper } from "@models/token/mapper/exchange-rate-mapper";
import { TokenState } from "@states/index";
import { isErrorResponse } from "@utils/validation-utils";
import BigNumber from "bignumber.js";
import { useAtom } from "jotai";
import { useTokenResource } from "./use-token-resource";

export const useExchange = () => {
  const { tokenRepository } = useRepository();
  const { getMetaInfo } = useTokenResource();

  const [standard] = useAtom(TokenState.standardTokenMeta);
  const [usdRate, setUSDRate] = useAtom(TokenState.usdRate);
  const [exchangeRates, setExchangeRates] = useAtom(TokenState.exchangeRates);

  const exchangeToken = (from: TokenDefaultModel, to: TokenDefaultModel) => {
    const exchangeRate = getExchangeRate(from, to);
    return exchangeTokenByRate(from, to, exchangeRate);
  };

  const exchangeTokenByRate = (
    from: TokenDefaultModel,
    to: TokenDefaultModel,
    exchangeRate: BigNumber,
  ) => {
    const fromToken = convertToDefaultDenom(from);
    const toToken = convertToDefaultDenom(to);
    if (!fromToken || !toToken) {
      return null;
    }

    const exchangeAmount =
      fromToken.amount.value.multipliedBy(exchangeRate) ?? BigNumber(0);
    return {
      ...toToken,
      amount: {
        value: exchangeAmount,
        denom: toToken.amount.denom,
      },
    };
  };

  const tokenToUSD = (token: TokenDefaultModel) => {
    const defaultToken = convertToDefaultDenom(token);
    if (!defaultToken) {
      return BigNumber(0);
    }
    const standardExchangeRate = getExchangeRateFromStandard(defaultToken);
    if (!standardExchangeRate || !usdRate || !defaultToken.amount) {
      return BigNumber(0);
    }
    const tokenAmount = defaultToken.amount.value;
    return tokenAmount.multipliedBy(standardExchangeRate).multipliedBy(usdRate);
  };

  const tokenPairToUSD = (tokenPair: TokenPairModel) => {
    const token0USDValue = tokenToUSD(tokenPair.token0);
    const token1USDValue = tokenToUSD(tokenPair.token1);
    return token0USDValue.plus(token1USDValue);
  };

  const convertToDefaultDenom = (token: TokenDefaultModel) => {
    const { tokenId, amount } = token;
    const metaInfo = getMetaInfo(tokenId);
    if (!amount || !metaInfo || !usdRate) {
      return null;
    }

    const tokenDefaultAmount = toDefaultDenom(
      amount,
      metaInfoToConfig(metaInfo),
    );
    return {
      ...token,
      amount: tokenDefaultAmount,
    };
  };

  const getExchangeRateFromStandard = (token: TokenDefaultModel) => {
    const standardTokenId = standard?.token_id ?? "1";
    const standardRate = exchangeRates.find(
      rate => rate.tokenId === standardTokenId,
    );
    const tokenRate = exchangeRates.find(
      rate => rate.tokenId === token.tokenId,
    );
    if (!standardRate || !tokenRate) {
      return BigNumber(1);
    }
    return tokenRate.rate.dividedBy(standardRate.rate);
  };

  const getExchangeRate = (from: TokenDefaultModel, to: TokenDefaultModel) => {
    const fromRate = getExchangeRateFromStandard(from);
    const toRate = getExchangeRateFromStandard(to);
    return fromRate.dividedBy(toRate);
  };

  const updateExchangeRates = () => {
    if (!standard) {
      return;
    }
    tokenRepository
      .getAllExchangeRates(standard.token_id)
      .then(ExchangeRateMapper.fromResponse)
      .then(response => setExchangeRates(response.rates));
  };

  const updateUSDRate = () => {
    if (!standard) {
      return;
    }
    tokenRepository
      .getUSDExchangeRate(standard.token_id)
      .then(
        response =>
          !isErrorResponse(response) && setUSDRate(BigNumber(response.rate)),
      );
  };

  return {
    usdRate,
    exchangeRates,
    getExchangeRate,
    exchangeToken,
    exchangeTokenByRate,
    tokenToUSD,
    tokenPairToUSD,
    updateExchangeRates,
    updateUSDRate,
  };
};
