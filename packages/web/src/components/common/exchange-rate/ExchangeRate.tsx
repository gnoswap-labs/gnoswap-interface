import { SwapFeeTierMaxPriceRangeMap, SwapFeeTierType } from "@constants/option.constant";
import { formatTokenExchangeRate } from "@utils/stake-position-utils";
import { useMemo } from "react";
import { ExchangeRateWrapper } from "./ExchangeRate.styles";

interface Props {
  value: string;
  feeTier?: SwapFeeTierType
}

const ExchangeRate: React.FC<Props> = ({ value, feeTier }) => {
  const exchangePrice = useMemo(() => {
    if (isNaN(Number(value))) {
      return value;
    }

    const valueStr = value.toString();

    const range = feeTier ? SwapFeeTierMaxPriceRangeMap[feeTier] : null;

    const currentValue = Number(valueStr);

    if (!isNaN(currentValue) && range && currentValue / range.maxPrice > 0.9) {
      return "∞";
    }

    return formatTokenExchangeRate(value);
  },
    [feeTier, value]
  );

  return (
    <ExchangeRateWrapper>
      {exchangePrice}
    </ExchangeRateWrapper>
  );
};

export default ExchangeRate;
