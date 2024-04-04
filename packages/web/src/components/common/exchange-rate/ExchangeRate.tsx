import { removeTrailingZeros } from "@utils/number-utils";
import { ExchangeRateWrapper } from "./ExchangeRate.styles";

interface Props {
  value: any;
}

function countZeros(decimalFraction: string) {
  const scientificNotation = parseFloat(decimalFraction).toExponential();
  const exponent = parseFloat(scientificNotation.split("e")[1]);
  return Math.abs(exponent);
}

const ExchangeRate: React.FC<Props> = ({ value }) => {
  const temp = `${value}`;
  const numberOfZero = countZeros(value);
  if (Number(value) === 0) return <>0</>;
  if (value[0] !== "0" || !value.startsWith("0.00000")) return <>{removeTrailingZeros(value)}</>;
  return (
    <ExchangeRateWrapper>
      0.{numberOfZero > 1 ? 0 : ""}<span>{numberOfZero - 1}</span>
      {removeTrailingZeros(temp.slice(numberOfZero + 1, numberOfZero + 6))}
    </ExchangeRateWrapper>
  );
};

export default ExchangeRate;
