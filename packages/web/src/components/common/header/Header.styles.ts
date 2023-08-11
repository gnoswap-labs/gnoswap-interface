import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";
import { Z_INDEX } from "@styles/zIndex";

export const HeaderWrapper = styled.header`
  ${mixins.flexbox("column", "center", "center")};
  top: 0;
  position: fixed;
  z-index: ${Z_INDEX.fixed};
  width: 100%;
  gap: 10px;
  background-color: ${({ theme }) => theme.color.background01};
  border-bottom: 1px solid ${({ theme }) => theme.color.border02};
`;

export const BottomNavWrapper = styled.nav`
  ${mixins.flexbox("column", "center", "center")};
  ${fonts.p1};
  width: 100%;
  bottom: 0px;
  position: fixed;
  z-index: ${Z_INDEX.fixed};
  border-radius: 8px 8px 0px 0px;
  backdrop-filter: blur(6px);
  border: 1px solid ${({ theme }) => theme.color.border02};
  background-color: ${({ theme }) => theme.color.backgroundOpacity2};
`;

export const BottomNavContainer = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  max-width: 360px;
  width: 100%;
  padding: 0px 24px;
`;

export const BottomNavItem = styled.div`
  ${mixins.flexbox("row", "center", "center")};
  padding: 16px 8px;
  transition: color 0.3s ease;
  color: ${({ theme }) => theme.color.text04};
  &.selected,
  &:hover {
    color: ${({ theme }) => theme.color.text03};
  }
`;

export const HeaderContainer = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  max-width: 1440px;
  width: 100%;
  padding: 17px 40px;
  ${media.tablet} {
    max-width: 1180px;
    padding: 12px 40px;
  }
  ${media.mobile} {
    padding: 8px 16px;
  }
`;

export const LeftSection = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  max-width: 895px;
  width: 100%;
  gap: 50px;
  ${media.tablet} {
    max-width: 422px;
    gap: 32px;
  }
  ${media.mobile} {
    max-width: 21px;
  }
`;

export const LogoLink = styled.a`
  width: 31.5px;
  height: 36px;
  ${media.tablet} {
    width: 28px;
    height: 32px;
  }
  ${media.mobile} {
    width: 21px;
    height: 24px;
  }
  .header-main-logo {
    width: 31.501px;
    height: 36px;
    ${media.tablet} {
      width: 28.001px;
      height: 32px;
    }
    ${media.mobile} {
      width: 21px;
      height: 24px;
    }
  }
`;

export const Navigation = styled.nav`
  ${mixins.flexbox("row", "center", "flex-start")};
  gap: 30px;
  ${media.tablet} {
    gap: 12px;
  }
  ul {
    ${mixins.flexbox("row", "center", "center")};
    gap: 40px;
    ${media.tablet} {
      gap: 16px;
    }
  }
  li {
    padding: 8px 0px;
    transition: color 0.3s ease;
    ${mixins.flexbox("row", "center", "center")};
    ${fonts.body9};
    color: ${({ theme }) => theme.color.text04};
    &.selected,
    &:hover {
      color: ${({ theme }) => theme.color.text03};
    }
    ${media.tablet} {
      padding: 8px 12px;
      ${fonts.body11};
    }
  }
`;

export const RightSection = styled.div`
  ${mixins.flexbox("row", "center", "flex-end")};
  max-width: 255px;
  width: 100%;
  gap: 16px;
  ${media.tablet} {
    max-width: 231px;
    gap: 8px;
  }
`;

export const SearchContainer = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  gap: 18px;
  ${media.tablet} {
    gap: 10px;
  }
`;

export const SearchButton = styled.button`
  ${mixins.flexbox("row", "center", "flex-start")};
  border-radius: 4px;
  transition: all 0.3s ease;
  .search-icon {
    width: 34px;
    height: 34px;
    * {
      fill: ${({ theme }) => theme.color.icon05};
    }
    ${media.tablet} {
      width: 30px;
      height: 30px;
    }
  }
  &:hover {
    .search-icon * {
      fill: ${({ theme }) => theme.color.icon02};
    }
  }
`;
