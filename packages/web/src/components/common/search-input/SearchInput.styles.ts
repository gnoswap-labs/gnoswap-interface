import { CSSProperties } from "react";
import styled from "@emotion/styled";
import mixins from "@styles/mixins";
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

  &:focus-within {
    background-color: ${({ theme }) => theme.color.background13};
    border: 1px solid ${({ theme }) => theme.color.border03};
    color: ${({ theme }) => theme.color.text01};
    .search-icon * {
      fill: ${({ theme }) => theme.color.icon03};
    }
  }

  &:not(:focus-within, .empty-status) {
    background-color: ${({ theme }) => theme.color.background06};
    border: 1px solid ${({ theme }) => theme.color.border02};
    color: ${({ theme }) => theme.color.text14};
    .search-icon * {
      fill: ${({ theme }) => theme.color.icon03};
    }
  }

  &:not(:focus-within).empty-status {
    background-color: ${({ theme }) => theme.color.background01};
    border: 1px solid ${({ theme }) => theme.color.border02};
    color: ${({ theme }) => theme.color.text13};
    .search-icon * {
      fill: ${({ theme }) => theme.color.icon08};
    }
  }
`;

export const InputStyle = styled.input`
  width: 100%;
  height: 100%;
  margin-right: 16px;
  &::placeholder {
    color: ${({ theme }) => theme.color.text04};
  }
`;
