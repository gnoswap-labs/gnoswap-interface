import { formatExchangeRate } from "@utils/number-utils";
import { useMemo } from "react";
import { ExchangeRateWrapper } from "./ExchangeRate.styles";

interface Props {
  value: any;
}

const ExchangeRate: React.FC<Props> = ({ value }) => {
  const exchangePrice = useMemo(() => formatExchangeRate(value), [value]);

  return (
    <ExchangeRateWrapper>
      {exchangePrice}
    </ExchangeRateWrapper>
  );
};

export default ExchangeRate;
