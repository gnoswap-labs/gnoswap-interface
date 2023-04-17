import { PaletteKeyType } from "@/styles/ThemeTypes";
import { CSSProperties } from "react";
import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { css } from "@emotion/react";
import { fonts } from "@constants/font.constant";
export interface SearchInputStyleProps {
  fullWidth?: boolean;
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
}

export const SearchInputWrapper = styled.div<SearchInputStyleProps>`
  ${mixins.flexbox("row", "center", "space-between")};
  ${fonts.body9};
  width: ${({ width, fullWidth }) => {
    if (width) return typeof width === "number" ? width + "px" : width;
    if (fullWidth) return "100%";
    return "auto";
  }};
  height: ${({ height }) => {
    if (height) return typeof height === "number" ? height + "px" : height;
    return "auto";
  }};
  padding: 0px 16px;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.colorWhite};

  &:focus-within {
    background-color: ${({ theme }) => theme.colors.gray50};
    border: 1px solid ${({ theme }) => theme.colors.gray40};
  }

  &:not(:focus-within, .empty-status) {
    background-color: ${({ theme }) => theme.colors.gray60};
    border: 1px solid ${({ theme }) => theme.colors.gray50};
  }

  &:not(:focus-within).empty-status {
    background-color: ${({ theme }) => theme.colors.colorBlack};
    border: 1px solid ${({ theme }) => theme.colors.gray50};
  }

  .search-icon * {
    fill: ${({ theme }) => theme.colors.gray01};
  }
`;

export const inputStyle = css`
  width: 100%;
  height: 100%;
  margin-right: 16px;
`;
