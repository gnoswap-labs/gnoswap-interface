import styled from "@emotion/styled";
import mixins from "@/styles/mixins";
import { FontsKeyType, PaletteKeyType } from "@/styles/ThemeTypes";
import { CSSProperties } from "react";

export enum BadgeHierarchy {
  Default = "Default",
  Primary = "Primary",
  Line = "Line",
}

export interface BadgeStyleProps {
  hierarchy?: BadgeHierarchy;
  fontType?: FontsKeyType;
  textColor?: PaletteKeyType;
  bgColor?: PaletteKeyType;
  borderColor?: PaletteKeyType;
  height?: CSSProperties["height"];
}

export const BadgeWrapper = styled.div<BadgeStyleProps>`
  ${mixins.flexbox("row", "center", "center", false)};
  height: ${({ height }) => {
    if (height) return typeof height === "number" ? height + "px" : height;
    return "24px";
  }};
  background-color: ${({ hierarchy, bgColor, theme }) => {
    if (hierarchy === BadgeHierarchy.Default) return theme.colors.opacityDark05;
    if (hierarchy === BadgeHierarchy.Primary) return theme.colors.colorPoint;
    if (hierarchy === BadgeHierarchy.Line) return theme.colors.opacityDark05;
    return theme.colors[bgColor ?? "colorPoint"];
  }};
  border: 1px solid
    ${({ hierarchy, borderColor, theme }) => {
      if (hierarchy === BadgeHierarchy.Default) return theme.colors.gray40;
      if (hierarchy === BadgeHierarchy.Primary) return theme.colors.brand50;
      if (hierarchy === BadgeHierarchy.Line) return theme.colors.colorPoint;
      return theme.colors[borderColor ?? "brand50"];
    }};
  border-radius: 4px;
  padding: 0px 6px;
`;

export const BadgeText = styled.span<BadgeStyleProps>`
  ${({ theme, fontType }) => theme.fonts[fontType ?? "p3"]};
  color: ${({ hierarchy, theme, textColor }) => {
    if (hierarchy === BadgeHierarchy.Default) return theme.colors.gray20;
    if (hierarchy === BadgeHierarchy.Primary) return theme.colors.brand10;
    if (hierarchy === BadgeHierarchy.Line) return theme.colors.colorPoint;
    return theme.colors[textColor ?? "brand10"];
  }};
`;
