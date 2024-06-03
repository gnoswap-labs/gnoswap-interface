import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export interface OverlapLogoStyleProps {
  size?: number;
}

export const OverlapLogoWrapper = styled.div<OverlapLogoStyleProps>`
  ${mixins.flexbox("row", "center", "center")};
`;

export interface OverlapLogoImageProps {
  size: number;
  overlap: number;
}

export const OverlapLogoImageWrapper = styled.div<OverlapLogoImageProps>`
  ${mixins.flexbox("row", "center", "center")};
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  margin-left: ${({ overlap }) => `-${overlap}px`};

  img {
    width: ${({ size }) => `${size}px`};
    height: ${({ size }) => `${size}px`};
    border-radius: 50%;
  }
`;
