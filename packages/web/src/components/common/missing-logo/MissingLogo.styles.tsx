import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";

interface Props {
  width: number;
  mobileWidth?: number;
  placeholderFontSize?: number;
}

const getFontSize = (width: number | undefined): string => {
  if (!width) return "6";
  if (width === 36) return "13";
  if (width === 32) return "12";
  if (width === 28) return "10";
  if (width === 24) return "9";
  if (width === 21) return "8";
  if (width === 20) return "7";
  return "6";
};

export const Image = styled.img<Props>`
  min-width: ${({ width }) => {
    return `${width}px`;
  }};
  width: ${({ width }) => {
    return `${width}px`;
  }};
  height: ${({ width }) => {
    return `${width}px`;
  }};
  ${media.mobile} {
    font-size: ${({ mobileWidth }) => {
      return `${getFontSize(mobileWidth)}px`;
    }};
    height: ${({ mobileWidth }) => {
      return `${mobileWidth}px`;
    }};
    min-width: ${({ mobileWidth }) => {
      return `${mobileWidth}px`;
    }};
    width: ${({ mobileWidth }) => {
      return `${mobileWidth}px`;
    }};
  }
`;

export const LogoWrapper = styled.div<Props>`
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  min-width: ${({ width }) => `${width}px`};
  border-radius: 50%;
  color: ${({ theme }) => theme.color.text02};
  background-color: ${({ theme }) => theme.color.text04};

  line-height: 10px;
  width: ${({ width }) => {
    return `${width}px`;
  }};
  height: ${({ width }) => {
    return `${width}px`;
  }};
  font-weight: 600;
  font-size: ${({ width, placeholderFontSize }) => {
    if (placeholderFontSize) return `${placeholderFontSize}px`;
    return `${getFontSize(width)}px`;
  }};
  ${media.mobile} {
    font-size: ${({ mobileWidth, placeholderFontSize }) => {
      if (placeholderFontSize) return `${placeholderFontSize}px`;
      return `${getFontSize(mobileWidth)}px`;
    }};
    height: ${({ mobileWidth }) => {
      return `${mobileWidth}px`;
    }};
    min-width: ${({ mobileWidth }) => {
      return `${mobileWidth}px`;
    }};
    width: ${({ mobileWidth }) => {
      return `${mobileWidth}px`;
    }};
  }
`;

export const TokenSymbolWrapper = styled.div`
  ${fonts.p1};
  white-space: pre;
`;
