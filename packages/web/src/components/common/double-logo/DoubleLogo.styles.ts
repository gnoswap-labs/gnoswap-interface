import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export interface DoubleLogoStyleProps {
  size?: string | number;
  overlap?: string | number;
}

export const DoubleLogoWrapper = styled.div<DoubleLogoStyleProps>`
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
    background-color: ${({ theme }) => theme.color.text04};
    ${fonts.p6}
    ${media.mobile} {
      font-size: 8px;
      line-height: 10px;
    }
  }
`;
