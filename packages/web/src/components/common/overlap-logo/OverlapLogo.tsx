import Tooltip from "../tooltip/Tooltip";
import { OverlapLogoImageWrapper, OverlapLogoStyleProps, OverlapLogoWrapper, TokenSymbolWrapper } from "./OverlapLogo.styles";

export interface ILogoData {
  src: string,
  tooltipContent?: string
}

export interface OverlapLogoProps extends OverlapLogoStyleProps {
  logos: ILogoData[];
}

const OverlapLogo = ({ logos, size = 36 }: OverlapLogoProps) => {
  return (
    <OverlapLogoWrapper size={size}>
      {logos.map((logo, index) =>
        <Tooltip
          key={`${index}${logo.src}`}
          placement="top"
          FloatingContent={logo.tooltipContent ? <TokenSymbolWrapper>{logo.tooltipContent}</TokenSymbolWrapper> : undefined}
          floatClassName="token-logo-tooltip"
        >
          <OverlapLogoImageWrapper
            overlap={index > 0 ? (size / 3) : 0}
            size={size}
            className="overlap-logo-wrapper"
          >
            <img src={logo.src} alt="logo-image" />
          </OverlapLogoImageWrapper>
        </Tooltip>
      )
      }
    </OverlapLogoWrapper >
  );
};

export default OverlapLogo;
