import { CSSProperties } from "react";
import styled from "@emotion/styled";
import mixins from "@/styles/mixins";
import { FontsKeyType, PaletteKeyType } from "@/styles/ThemeTypes";

export interface ButtonStyleProps {
  hierarchy?: ButtonHierarchy;
  fontType?: FontsKeyType;
  textColor?: PaletteKeyType;
  bgColor?: PaletteKeyType;
  fullWidth?: boolean;
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  radius?: CSSProperties["borderRadius"];
  justify?: CSSProperties["justifyContent"];
  padding?: CSSProperties["padding"];
}

export enum ButtonHierarchy {
  Primary = "Primary",
  Dark = "Dark",
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
  ${({ theme, fontType }) => theme.fonts[fontType ?? "body9"]};
  color: ${({ theme, textColor }) => theme.colors[textColor ?? "gray10"]};
`;
