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
    return `${size === 36
      ? "13"
      : size === 32
        ? "12"
        : size === 28
          ? "10"
          : size === 24
            ? "9"
            : size === 21
              ? "8"
              : size === 20
                ? "7"
                : "6"
      }px`;
  }};
  }
`;

export const TokenSymbolWrapper = styled.div`
  ${fonts.p1}
`;
