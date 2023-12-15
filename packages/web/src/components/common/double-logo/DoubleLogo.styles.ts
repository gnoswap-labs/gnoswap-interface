import styled from "@emotion/styled";
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
    font-weight: 600;
    border-radius: 50%;
    color: ${({ theme }) => theme.color.text02};
    background-color: ${({ theme }) => theme.color.text04};
    font-size: ${({ size = 36 }) => {
      return `${size === 36 ? "14" : size === 32 ? "12" : (size === 28 || size === 24) ? "10" : (size === 21 || size === 20) ? "8" : "6"}px`;
    }};
  }
`;
