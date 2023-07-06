import BigNumber from "bignumber.js";
import { ExchangeRate, ExchangeRateResponse } from "@repositories/token";
import {
  ExchangeRateModel,
  ExchangeRateToBigNumType,
} from "@models/token/exchange-rate-model";

export class ExchangeRateMapper {
  public static fromResponse(
    response: ExchangeRateResponse,
  ): ExchangeRateModel {
    return {
      tokenId: response.token_id,
      rates: response.rates.map(ExchangeRateMapper.mappedRatesBigNumber),
    };
  }

  private static mappedRatesBigNumber(
    rate: ExchangeRate,
  ): ExchangeRateToBigNumType {
    return {
      tokenId: rate.token_id,
      rate: BigNumber(rate.rate || 0),
    };
  }
}
