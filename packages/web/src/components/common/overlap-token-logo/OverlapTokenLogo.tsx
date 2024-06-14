import { TokenModel } from "@models/token/token-model";
import Tooltip from "../tooltip/Tooltip";
import { OverlapTokenLogoImageWrapper, OverlapTokenLogoStyleProps, OverlapTokenLogoWrapper, TokenSymbolWrapper } from "./OverlapTokenLogo.styles";

interface OverlapTokenLogoProps extends OverlapTokenLogoStyleProps {
  tokens: TokenModel[];
}

const OverlapTokenLogo = ({ tokens, size = 36 }: OverlapTokenLogoProps) => {
  return (
    <OverlapTokenLogoWrapper size={size}>
      {tokens.map((token, index) =>
        <Tooltip key={`${index}${token.logoURI}`} placement="top" FloatingContent={<TokenSymbolWrapper>{token.symbol}</TokenSymbolWrapper>}>
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
        </Tooltip>
      )}
    </OverlapTokenLogoWrapper>
  );
};

export default OverlapTokenLogo;
