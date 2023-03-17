import { DoubleLogoStyleProps, DoubleLogoWrapper } from "./DoubleLogo.styles";

interface DoubleLogoProps extends DoubleLogoStyleProps {
  left: string;
  right: string;
}

const DoubleLogo = ({ left, right, size, overlap }: DoubleLogoProps) => {
  return (
    <DoubleLogoWrapper overlap={overlap} size={size}>
      <img src={left} alt="logo-image" />
      <img src={right} alt="logo-image" className="right-logo" />
    </DoubleLogoWrapper>
  );
};

export default DoubleLogo;
