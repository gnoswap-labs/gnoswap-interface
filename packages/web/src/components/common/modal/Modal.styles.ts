import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { Z_INDEX } from "@styles/zIndex";
import { PaletteKeyType } from "@styles/ThemeTypes";
import { CSSProperties } from "react";
import { fonts, type FontsKey } from "@constants/font.constant";

export interface ModalStyleProps {
  fontType?: FontsKey;
  textColor?: PaletteKeyType;
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
}

export const ModalWrapper = styled.div<ModalStyleProps>`
  ${mixins.flexbox("column", "center", "space-between")};
  width: ${({ width }) => {
    if (width) return typeof width === "number" ? width + "px" : width;
    return "auto";
  }};
  height: ${({ height }) => {
    if (height) return typeof height === "number" ? height + "px" : height;
    return "auto";
  }};
  padding: 24px;
  ${mixins.positionCenter()};
  z-index: ${Z_INDEX.modal};
  background-color: ${({ theme }) => theme.colors.gray60};
  border: 1px solid ${({ theme }) => theme.colors.gray50};
  box-shadow: 10px 14px 60px rgba(0, 0, 0, 0.4);
  border-radius: 8px;
`;

export const ModalHeader = styled.div<ModalStyleProps>`
  ${mixins.flexbox("row", "center", "space-between")};
  ${({ fontType }) => fonts[fontType ?? "h6"]};
  color: ${({ theme, textColor }) => theme.colors[textColor ?? "gray10"]};
  width: 100%;
  svg * {
    fill: ${({ theme }) => theme.colors.gray10};
  }
`;

export const IconButton = styled.button`
  ${mixins.flexbox("row", "center", "center")};
  width: 24px;
  height: 24px;
  &.exit-button {
    margin-left: auto;
  }
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.opacityDark07};
  overflow: hidden;
  z-index: ${Z_INDEX.modalOverlay};
`;
