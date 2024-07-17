import { TokenModel } from "@models/token/token-model";
import MissingLogo from "../missing-logo/MissingLogo";
import Tooltip from "../tooltip/Tooltip";
import {
  OverlapTokenLogoImageWrapper,
  OverlapTokenLogoStyleProps,
  OverlapTokenLogoWrapper,
  TokenSymbolWrapper,
} from "./OverlapTokenLogo.styles";

interface OverlapTokenLogoProps extends OverlapTokenLogoStyleProps {
  tokens: TokenModel[];
  placeholderFontSize?: number;
  tokenTooltipClassName?: string;
}

const OverlapTokenLogo = ({
  tokens,
  size = 36,
  placeholderFontSize,
  mobileSize,
  tokenTooltipClassName,
}: OverlapTokenLogoProps) => {
  return (
    <OverlapTokenLogoWrapper size={size}>
      {tokens.map((token, index) => (
        <Tooltip
          key={`${index}${token.logoURI}`}
          placement="top"
          className={tokenTooltipClassName}
          FloatingContent={
            <TokenSymbolWrapper>{token.symbol}</TokenSymbolWrapper>
          }
        >
          <OverlapTokenLogoImageWrapper
            key={index}
            overlap={index > 0 ? size / 3 : 0}
            size={size}
          >
            <MissingLogo
              className={tokenTooltipClassName}
              width={size}
              url={token.logoURI}
              mobileWidth={mobileSize}
              symbol={token.symbol.slice(0, 3)}
              placeholderFontSize={placeholderFontSize}
            />
          </OverlapTokenLogoImageWrapper>
        </Tooltip>
      ))}
    </OverlapTokenLogoWrapper>
  );
};

export default OverlapTokenLogo;
