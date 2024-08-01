import { DoubleLogoStyleProps, DoubleLogoWrapper } from "./DoubleLogo.styles";

interface DoubleLogoProps extends DoubleLogoStyleProps {
  left: string;
  right: string;
  leftSymbol?: string;
  rightSymbol?: string;
}

const DoubleLogo = ({
  left,
  right,
  size,
  overlap,
  leftSymbol = "",
  rightSymbol = "",
}: DoubleLogoProps) => {
  return (
    <DoubleLogoWrapper overlap={overlap} size={size}>
      {left ? (
        <img src={left} alt="logo-image" />
      ) : (
        <div className="missing-logo">{leftSymbol.slice(0, 3)}</div>
      )}
      {right ? (
        <img src={right} alt="logo-image" className="right-logo" />
      ) : (
        <div className="missing-logo right-logo">{rightSymbol.slice(0, 3)}</div>
      )}
    </DoubleLogoWrapper>
  );
};

export default DoubleLogo;
