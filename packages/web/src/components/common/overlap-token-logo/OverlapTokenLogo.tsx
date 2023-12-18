import { TokenModel } from "@models/token/token-model";
import { OverlapTokenLogoImageWrapper, OverlapTokenLogoStyleProps, OverlapTokenLogoWrapper } from "./OverlapTokenLogo.styles";

interface OverlapTokenLogoProps extends OverlapTokenLogoStyleProps {
  tokens: TokenModel[];
}

const OverlapTokenLogo = ({ tokens, size = 36 }: OverlapTokenLogoProps) => {
  return (
    <OverlapTokenLogoWrapper size={size}>
      {tokens.map((token, index) =>
        <OverlapTokenLogoImageWrapper
          key={index}
          overlap={index > 0 ? (size / 3) : 0}
          size={size}
        >
          {token.logoURI ? (
            <img src={token.logoURI} alt="logo-image" />
          ) : (
            <div className="missing-logo right-logo">{token.symbol.slice(0, 3)}</div>
          )}
        </OverlapTokenLogoImageWrapper>
      )}
    </OverlapTokenLogoWrapper>
  );
};

export default OverlapTokenLogo;
