import React from "react";
import Tooltip from "../tooltip/Tooltip";
import { LogoWrapper, Image, TokenSymbolWrapper } from "./MissingLogo.styles";

interface Props {
  symbol: string;
  url?: string;
  className?: string;
  width: number;
  mobileWidth?: number;
  missingLogoClassName?: string;
  placeholderFontSize?: number;
  tokenTooltipClassName?: string;
  showTooltip?: boolean;
}

const MissingLogo: React.FC<Props> = ({
  symbol,
  className,
  url,
  width,
  mobileWidth,
  missingLogoClassName,
  placeholderFontSize,
  tokenTooltipClassName,
  showTooltip = false,
}) => {
  return (
    <Tooltip
      placement="top"
      className={tokenTooltipClassName}
      isShouldShowed={showTooltip}
      FloatingContent={<TokenSymbolWrapper>{symbol}</TokenSymbolWrapper>}
    >
      {url ? (
        <Image
          mobileWidth={mobileWidth}
          width={width}
          src={url}
          alt="logo"
          className={className}
        />
      ) : (
        <LogoWrapper
          width={width}
          mobileWidth={mobileWidth}
          className={`missing-logo ${missingLogoClassName}`}
          placeholderFontSize={placeholderFontSize}
        >
          {(symbol || "").slice(0, 3)}
        </LogoWrapper>
      )}
    </Tooltip>
  );
};

export default MissingLogo;
