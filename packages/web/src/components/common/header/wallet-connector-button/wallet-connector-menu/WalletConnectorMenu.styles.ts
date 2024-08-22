import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";
import { Z_INDEX } from "@styles/zIndex";

export interface WalletMenuProps {
  width?: number;
}

export const WalletConnectorMenuWrapper = styled.div<WalletMenuProps>`
  position: absolute;
  width: 280px;
  top: 45px;
  background-color: ${({ theme }) => theme.color.background06};
  border: 1px solid ${({ theme }) => theme.color.border02};
  border-radius: 8px;
  box-shadow: 8px 8px 20px rgba(0, 0, 0, 0.2);
  padding: 16px;
  z-index: ${Z_INDEX.modal};
  right: ${({ width }) => {
    return width && width < 1521 && "0px";
  }};
  left: ${({ width }) => {
    return width && width < 768 && "0px";
  }};
  @media (min-width: 1521px) {
    left: 0;
  }

  ${media.tablet} {
    top: 46px;
    right: -50px;
  }
  ${media.mobile} {
    ${mixins.flexbox("column", "center", "flex-start")};
    position: fixed;
    width: 100%;
    height: fit-content;
    top: auto;
    bottom: 0;
    z-index: ${Z_INDEX.modal};
    padding: 23px 15px;
    min-width: 360px;
    gap: 0;
  }

  .button-container {
    ${media.mobile} {
      ${mixins.flexbox("column", "center", "flex-start")};
      width: 100%;
    }
  }

  .theme-container {
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
    ${media.mobile} {
      ${mixins.flexbox("column", "center", "center")};
      width: 100%;
    }
  }
`;

export const MenuHeader = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  ${media.mobile} {
    width: 100%;
  }
  .user-address {
    ${fonts.p1};
    color: ${({ theme }) => theme.color.text02};
    margin: 0px auto 0px 8px;
  }
`;

export const IconButton = styled.button`
  ${mixins.flexbox("row", "center", "center")};
  width: 16px;
  height: 16px;
  margin-left: 8px;
  position: relative;
  svg * {
    fill: ${({ theme }) => theme.color.icon03};
  }
  .action-icon {
    &:hover * {
      fill: ${({ theme }) => theme.color.icon07};
    }
  }
`;

export const AmountInfoBox = styled.div`
  ${mixins.flexbox("row", "center", "center")};
  ${fonts.body7};
  width: 100%;
  height: 57px;
  background-color: ${({ theme }) => theme.color.backgroundOpacity};
  border-radius: 8px;
  color: ${({ theme }) => theme.color.text03};
  margin-top: 16px;
  ${media.mobile} {
    height: 63px;
  }
`;

export const ThemeSelector = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  ${fonts.p2};
  color: ${({ theme }) => theme.color.text05};
  width: 100%;
  height: 36px;
  &.mt-16 {
    margin-top: 16px;
  }
`;

export const CopyTooltip = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  position: absolute;
  top: -70px;
  left: -35px;
  z-index: ${Z_INDEX.modalTooltip};
  .box {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 84px;
    padding: 16px;
    gap: 8px;
    flex-shrink: 0;
    border-radius: 8px;
    ${fonts.body12};
    color: ${({ theme }) => theme.color.text02};
    background-color: ${({ theme }) => theme.color.background02};
  }
  .dark-shadow {
    box-shadow: 8px 8px 20px 0px rgba(0, 0, 0, 0.2);
  }
  .light-shadow {
    box-shadow: 10px 14px 48px 0px rgba(0, 0, 0, 0.12);
  }
  .polygon-icon * {
    fill: ${({ theme }) => theme.color.background02};
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
  overflow: hidden;
  z-index: ${Z_INDEX.modalOverlay};
`;
