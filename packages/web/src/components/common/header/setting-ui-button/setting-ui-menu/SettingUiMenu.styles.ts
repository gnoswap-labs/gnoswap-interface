import styled from "@emotion/styled";
import { fonts } from "@constants/font.constant";
import mixins from "@styles/mixins";
import { Z_INDEX } from "@styles/zIndex";

export interface SettingUiMenuProps {
  width?: number;
}

export const SettingUiMenuWrapper = styled.div<SettingUiMenuProps>`
  position: absolute;
  width: 280px;
  top: 45px;
  background-color: ${({ theme }) => theme.color.background06};
  border: 1px solid ${({ theme }) => theme.color.border02};
  border-radius: 8px;
  box-shadow: 8px 8px 20px rgba(0, 0, 0, 0.2);
  padding: 16px;
  z-index: ${Z_INDEX.modal};
  right: 0;
`;

export const SettingUiMenuContent = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  gap: 16px;
`;

export const SettingUiMenuTitle = styled.div`
  color: ${({ theme }) => theme.color.text02};
  font-size: 16px;
  font-weight: 500;
`;

export const SettingUiMenuList = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  padding-top: 8px;
  & > .ui-setting-menu {
    width: 100%;
    padding: 0 9px;
    .language {
      gap: 4px;
      cursor: pointer;
      ${mixins.flexbox("row", "center", "center")};
      color: ${({ theme }) => theme.color.text01};
      ${fonts.p2}
      svg {
        width: 16px;
        height: 16px;
      }
      svg * {
        fill: ${({ theme }) => theme.color.icon03};
      }
      :hover {
        svg * {
          fill: ${({ theme }) => theme.color.icon07};
        }
      }
    }
  }
`;

export const ThemeSelector = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  ${fonts.p2};
  color: ${({ theme }) => theme.color.text05};
  width: 100%;
  height: 36px;
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: ${Z_INDEX.modalOverlay};
`;
