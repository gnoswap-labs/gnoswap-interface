import { TokenModel } from "@models/token/token-model";
import { DoubleTokenLogoWrapper } from "./DoubleTokenLogo.styles";
import TokenLogo from "../token-logo/TokenLogo";

interface DoubleTokenLogoProps {
  left: TokenModel;
  right: TokenModel;
  size?: string | number;
  overlap?: string | number;
  fontSize?: number;
}

const DoubleTokenLogo = ({ left, right, size, overlap, fontSize }: DoubleTokenLogoProps) => {
  return (
    <DoubleTokenLogoWrapper overlap={overlap} size={size} fontSize={fontSize}>
      <TokenLogo token={left} />
      <TokenLogo className="right-logo" token={right} />
    </DoubleTokenLogoWrapper>
  );
};

export default DoubleTokenLogo;
