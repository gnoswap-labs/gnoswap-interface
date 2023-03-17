import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const ThemeModeButtonWrapper = styled.div<{ darkMode: boolean }>`
  ${mixins.flexbox("row", "center", "center")};
  gap: 18px;
  position: relative;
  width: 70px;
  height: 28px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.colorBlack};
  cursor: pointer;
  svg {
    width: 16px;
    height: 16px;
    z-index: 1;
    &.dark-icon * {
      transition: all 0.3s ease;
      fill: ${({ darkMode, theme }) =>
        darkMode ? theme.colors.gray20 : theme.colors.gray50};
    }
    &.light-icon * {
      transition: all 0.3s ease;
      fill: ${({ darkMode, theme }) =>
        darkMode ? theme.colors.gray50 : theme.colors.gray20};
    }
  }
`;

export const ToggleButton = styled.div<{ darkMode: boolean }>`
  width: 32px;
  height: 24px;
  border-radius: 2px;
  transition: all 0.3s ease;
  position: absolute;
  left: ${({ darkMode }) => (darkMode ? "2px" : "36px")};
  background-color: ${({ theme }) => theme.colors.gray50};
`;
