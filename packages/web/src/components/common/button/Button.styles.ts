import { CSSProperties } from "react";
import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { PaletteKeyType } from "@styles/ThemeTypes";
import { ButtonHierarchy } from "./Button";
import { fonts, type FontsKey } from "@constants/font.constant";

export interface ButtonStyleProps {
  hierarchy?: ButtonHierarchy;
  fontType?: FontsKey;
  textColor?: PaletteKeyType;
  bgColor?: PaletteKeyType;
  fullWidth?: boolean;
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  radius?: CSSProperties["borderRadius"];
  justify?: CSSProperties["justifyContent"];
  padding?: CSSProperties["padding"];
}

export const ButtonWrapper = styled.button<ButtonStyleProps>`
  ${({ justify }) => mixins.flexbox("row", "center", justify ?? "center")};
  width: ${({ width, fullWidth }) => {
    if (width) return typeof width === "number" ? width + "px" : width;
    if (fullWidth) return "100%";
    return "auto";
  }};
  height: ${({ height }) => {
    if (height) return typeof height === "number" ? height + "px" : height;
    return "auto";
  }};
  border-radius: ${({ radius }) => (radius ? radius : "8px")};
  padding: ${({ padding }) => padding};
  transition: background-color 0.3s ease;
  background-color: ${({ hierarchy, bgColor, theme }) => {
    if (hierarchy === ButtonHierarchy.Primary) return theme.colors.brand50;
    if (hierarchy === ButtonHierarchy.Dark) return theme.colors.gray50;
    return theme.colors[bgColor ?? "brand50"];
  }};
  &:hover {
    background-color: ${({ hierarchy, theme }) => {
      if (hierarchy === ButtonHierarchy.Primary) return theme.colors.brand60;
      if (hierarchy === ButtonHierarchy.Dark) return theme.colors.gray60;
      return;
    }};
  }
  &:disabled {
    background-color: ${({ hierarchy, theme }) => {
      if (hierarchy === ButtonHierarchy.Primary) return theme.colors.gray40;
      return;
    }};
  }
`;

export const StyledText = styled.span<ButtonStyleProps>`
  ${({ fontType }) => fonts[fontType ?? "body9"]};
  color: ${({ theme, textColor }) => theme.colors[textColor ?? "gray10"]};
`;
