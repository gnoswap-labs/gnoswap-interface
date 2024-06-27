import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export interface OverlapTokenLogoStyleProps {
  size?: number;
  mobileSize?: number;
}

export const OverlapTokenLogoWrapper = styled.div<OverlapTokenLogoStyleProps>`
  ${mixins.flexbox("row", "center", "center")};
`;

export interface OverlapTokenLogoImageProps {
  size: number;
  overlap: number;
}

export const OverlapTokenLogoImageWrapper = styled.div<
  OverlapTokenLogoImageProps
>`
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

export const TokenSymbolWrapper = styled.div`
  ${fonts.p1}
`;
