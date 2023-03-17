import styled from "@emotion/styled";
import mixins from "@/styles/mixins";

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
`;
