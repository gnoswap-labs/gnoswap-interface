import { TokenModel } from "@models/token/token-model";
import MissingLogo from "../missing-logo/MissingLogo";
import {
  OverlapTokenLogoImageWrapper,
  OverlapTokenLogoStyleProps,
  OverlapTokenLogoWrapper,
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
        <OverlapTokenLogoImageWrapper
          key={index}
          overlap={index > 0 ? size / 3 : 0}
          size={size}
        >
          <MissingLogo
            showTooltip={true}
            className={tokenTooltipClassName}
            width={size}
            url={token.logoURI}
            mobileWidth={mobileSize}
            symbol={token.symbol.slice(0, 3)}
            placeholderFontSize={placeholderFontSize}
          />
        </OverlapTokenLogoImageWrapper>
      ))}
    </OverlapTokenLogoWrapper>
  );
};

export default OverlapTokenLogo;
