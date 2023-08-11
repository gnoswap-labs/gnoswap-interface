import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";
import { Z_INDEX } from "@styles/zIndex";

export const WalletConnectorMenuWrapper = styled.div`
  position: absolute;
  width: 280px;
  top: 54px;
  ${media.tablet} {
    top: 49px;
    right: 0px;
  }
  ${media.mobile} {
    ${mixins.flexbox("column", "center", "flex-start")};
    position: fixed;
    width: 100%;
    height: 172px;
    top: calc(100vh - 172px);
    z-index: ${Z_INDEX.modal};
  }

  .button-container {
    ${media.mobile} {
      ${mixins.flexbox("column", "center", "center")};
      max-width: 324px;
      width: 100%;
    }
  }

  .theme-container {
    ${media.mobile} {
      ${mixins.flexbox("column", "center", "center")};
      max-width: 324px;
      width: 100%;
    }
  }

  background-color: ${({ theme }) => theme.color.background06};
  border: 1px solid ${({ theme }) => theme.color.border02};
  border-radius: 8px;
  box-shadow: 8px 8px 20px rgba(0, 0, 0, 0.2);
  padding: 16px;
`;

export const MenuHeader = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
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
  svg * {
    fill: ${({ theme }) => theme.color.icon03};
  }
  :hover {
    svg * {
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
`;

export const ThemeSelector = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  ${fonts.p2};
  color: ${({ theme }) => theme.color.text05};
  width: 100%;
  height: 36px;
  margin-top: 16px;
`;
