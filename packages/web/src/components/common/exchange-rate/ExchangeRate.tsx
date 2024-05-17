import { formatExchangeRate } from "@utils/number-utils";
import { useMemo } from "react";
import { ExchangeRateWrapper } from "./ExchangeRate.styles";

interface Props {
  value: any;
}

const ExchangeRate: React.FC<Props> = ({ value }) => {
  const exchangePrice = useMemo(() => {
    const newVal = formatExchangeRate(value);
    console.log("🚀 ~ exchangePrice ~ newVal:", newVal);

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
