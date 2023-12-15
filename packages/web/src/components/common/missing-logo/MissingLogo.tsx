import React from "react";
import { LogoWrapper } from "./MissingLogo.styles";

interface Props {
  symbol: string;
  url?: string;
  className?: string;
  width: number;
  mobileWidth?: number;
}

const MissingLogo: React.FC<Props> = ({
  symbol,
  className,
  url,
  width,
  mobileWidth,
}) => {
  return (
    <>
      {url ? (
        <img src={url} alt="logo" className={className} />
      ) : (
        <LogoWrapper
          width={width}
          mobileWidth={mobileWidth}
          className="missing-logo"
        >
          {symbol.slice(0, 3)}
        </LogoWrapper>
      )}
    </>
  );
};

export default MissingLogo;
