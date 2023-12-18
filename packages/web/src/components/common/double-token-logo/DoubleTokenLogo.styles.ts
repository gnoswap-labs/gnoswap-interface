import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export interface DoubleTokenLogoStyleProps {
  size?: string | number;
  overlap?: string | number;
  fontSize?: number;
}

export const DoubleTokenLogoWrapper = styled.div<DoubleTokenLogoStyleProps>`
  ${mixins.flexbox("row", "center", "center")};
  img {
    width: ${({ size }) => {
      if (size) return typeof size === "number" ? `${size}px` : size;
      return "36px";
    }};
    height: ${({ size }) => {
      if (size) return typeof size === "number" ? `${size}px` : size;
      return "36px";
    }};
    border-radius: 50%;
  }
  .right-logo {
    margin-left: ${({ overlap }) => {
      if (overlap)
        return typeof overlap === "number" ? `-${overlap}px` : `-${overlap}`;
      return "-6px";
    }};
  }
  .missing-logo {
    ${mixins.flexbox("row", "center", "center")};
    width: ${({ size }) => {
      if (size) return typeof size === "number" ? `${size}px` : size;
      return "36px";
    }};
    height: ${({ size }) => {
      if (size) return typeof size === "number" ? `${size}px` : size;
      return "36px";
    }};
    border-radius: 50%;
    color: ${({ theme }) => theme.color.text02};
    background-color: ${({ theme }) => theme.color.border02};
    ${fonts.p6}
    font-size: ${({ fontSize }) => `${fontSize}px`};
    line-height: 1.1em;
    ${media.mobile} {
      font-size: 8px;
      line-height: 10px;
    }
  }
`;
