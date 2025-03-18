import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export interface DoubleLogoStyleProps {
  size?: string | number;
  overlap?: string | number;
}

const FONT_SIZES = {
  36: "13px",
  32: "12px",
  28: "10px",
  24: "9px",
  21: "8px",
  20: "7px",
  16: "6.5px",
} as const;

type SizeKey = keyof typeof FONT_SIZES;

const getSizeValue = (size: string | number | undefined) => {
  if (!size) return "36px";
  return typeof size === "number" ? `${size}px` : size;
};

const getFontSize = (size: string | number = 36): string => {
  const key = typeof size === "string" ? parseInt(size) : size;
  return FONT_SIZES[key as SizeKey];
};

export const DoubleLogoWrapper = styled.div<DoubleLogoStyleProps>`
  ${mixins.flexbox("row", "center", "center")};
  img {
    width: ${({ size }) => getSizeValue(size)};
    height: ${({ size }) => getSizeValue(size)};
    border-radius: 50%;
  }
  .right-logo {
    margin-left: ${({ overlap }) => {
      if (overlap) return typeof overlap === "number" ? `-${overlap}px` : `-${overlap}`;
      return "-6px";
    }};
  }
  .missing-logo {
    ${mixins.flexbox("row", "center", "center")};
    width: ${({ size }) => getSizeValue(size)};
    height: ${({ size }) => getSizeValue(size)};
    font-weight: 600;
    border-radius: 50%;
    color: ${({ theme }) => theme.color.text02};
    background-color: ${({ theme }) => theme.color.text04};
    font-size: ${({ size = 36 }) => getFontSize(size)};
  }
`;
