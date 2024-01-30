import _ from "lodash";
import { Currency, CurrencyAmount, TradeType } from "../core";
import { RouteWithValidQuote, V3RouteWithValidQuote } from "../entities";
import { Protocol, Trade } from "../router-sdk";
import { Route } from "../v3-sdk";

export function buildTrade(
  tokenInCurrency: Currency,
  tokenOutCurrency: Currency,
  tradeType: TradeType,
  routeAmounts: RouteWithValidQuote[],
) {
  /// Removed partition because of new mixedRoutes
  const v3RouteAmounts = _.filter(
    routeAmounts,
    routeAmount => routeAmount.protocol === Protocol.V3,
  );

  const v3Routes = _.map<
    V3RouteWithValidQuote,
    {
      routev3: Route<Currency, Currency>;
      inputAmount: CurrencyAmount;
      outputAmount: CurrencyAmount;
    }
  >(
    v3RouteAmounts as V3RouteWithValidQuote[],
    (routeAmount: V3RouteWithValidQuote) => {
      const { route, amount, quote } = routeAmount;

      // The route, amount and quote are all in terms of wrapped tokens.
      // When constructing the Trade object the inputAmount/outputAmount must
      // use native currencies if specified by the user. This is so that the Trade knows to wrap/unwrap.
      if (tradeType == TradeType.EXACT_INPUT) {
        const amountCurrency = CurrencyAmount.fromFractionalAmount(
          tokenInCurrency,
          amount.numerator,
          amount.denominator,
        );
        const quoteCurrency = CurrencyAmount.fromFractionalAmount(
          tokenOutCurrency,
          quote.numerator,
          quote.denominator,
        );

        const routeRaw = new Route(
          route.pools,
          amountCurrency.currency,
          quoteCurrency.currency,
        );

        return {
          routev3: routeRaw,
          inputAmount: amountCurrency,
          outputAmount: quoteCurrency,
        };
      } else {
        const quoteCurrency = CurrencyAmount.fromFractionalAmount(
          tokenInCurrency,
          quote.numerator,
          quote.denominator,
        );

        const amountCurrency = CurrencyAmount.fromFractionalAmount(
          tokenOutCurrency,
          amount.numerator,
          amount.denominator,
        );

        const routeCurrency = new Route(
          route.pools,
          quoteCurrency.currency,
          amountCurrency.currency,
        );

        return {
          routev3: routeCurrency,
          inputAmount: quoteCurrency,
          outputAmount: amountCurrency,
        };
      }
    },
  );

  const trade = new Trade({ v3Routes, tradeType });

  return trade;
}
