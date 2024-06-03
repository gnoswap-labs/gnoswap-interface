import { OverlapLogoImageWrapper, OverlapLogoStyleProps, OverlapLogoWrapper } from "./OverlapLogo.styles";

interface OverlapLogoProps extends OverlapLogoStyleProps {
  logos: string[];
}

const OverlapLogo = ({ logos, size = 36 }: OverlapLogoProps) => {
  return (
    <OverlapLogoWrapper size={size}>
      {logos.map((logo, index) =>
        <OverlapLogoImageWrapper
          key={index}
          overlap={index > 0 ? (size / 3) : 0}
          size={size}
          className="overlap-logo-wrapper"
        >
          <img src={logo} alt="logo-image" />
        </OverlapLogoImageWrapper>
      )}
    </OverlapLogoWrapper>
  );
};

export default OverlapLogo;
