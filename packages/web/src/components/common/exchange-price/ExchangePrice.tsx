import { ExchangePriceWrapper } from "./ExchangePrice.styles";

interface Props {}

const ExchangePrice:React.FC<Props> = () => {
  return (
    <ExchangePriceWrapper>
      0.0<span>7</span>12345
    </ExchangePriceWrapper>
  );
};

export default ExchangePrice;
