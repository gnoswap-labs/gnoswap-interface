import { formatExchangeRate } from "@utils/number-utils";
import { useMemo } from "react";
import { ExchangeRateWrapper } from "./ExchangeRate.styles";

interface Props {
  value: string;
}

const ExchangeRate: React.FC<Props> = ({ value }) => {
  const exchangePrice = useMemo(() => {
    if (isNaN(Number(value))) {
      return value;
    }

    const newVal = formatExchangeRate(Number(value));

    return newVal;
  },
    [value]
  );

  return (
    <ExchangeRateWrapper>
      {exchangePrice}
    </ExchangeRateWrapper>
  );
};

export default ExchangeRate;
