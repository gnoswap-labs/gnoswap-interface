import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { Z_INDEX } from "@styles/zIndex";

export const HeaderWrapper = styled.header`
  ${mixins.flexbox("column", "center", "center")};
  top: 0;
  position: fixed;
  z-index: ${Z_INDEX.fixed};
  width: 100%;
  height: 71px;
  gap: 10px;
  background-color: ${({ theme }) => theme.color.background01};
  border-bottom: 1px solid ${({ theme }) => theme.color.border02};
`;

export const HeaderContainer = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  max-width: 1440px;
  width: 100%;
  padding: 17px 40px;
`;

export const LeftSection = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  max-width: 895px;
  width: 100%;
  height: 36px;
  gap: 50px;
`;

export const Navigation = styled.nav`
  ${mixins.flexbox("row", "center", "flex-start")};
  gap: 30px;
  ul {
    ${mixins.flexbox("row", "center", "center")};
    gap: 40px;
  }
  li {
    transition: color 0.3s ease;
    ${mixins.flexbox("row", "center", "center")};
    ${fonts.body9};
    color: ${({ theme }) => theme.color.text04};
    &.selected,
    &:hover {
      color: ${({ theme }) => theme.color.text03};
    }
  }
`;

export const RightMenuWrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  gap: 30px;
`;

export const RightSection = styled.div`
  ${mixins.flexbox("row", "center", "flex-end")};
  max-width: 255px;
  width: 100%;
  gap: 16px;
`;

export const SearchContainer = styled.div`
  ${mixins.flexbox("row", "center", "flex-end")};
  width: 100%;
  gap: 18px;
`;

export const SearchButton = styled.button`
  ${mixins.flexbox("row", "center", "center")};
  width: 36px;
  height: 36px;
  border-radius: 4px;
  transition: all 0.3s ease;
  .search-icon * {
    fill: ${({ theme }) => theme.color.icon05};
  }
  &:hover {
    .search-icon * {
      fill: ${({ theme }) => theme.color.icon02};
    }
  }
`;

export const LogoLink = styled.a`
  ${mixins.flexbox("row", "center", "center")};
  svg {
    width: 32px;
    height: 36px;
  }
`;

export const ButtonWrapper = styled.button`
  ${mixins.flexbox("row", "center", "center")};
  position: relative;
  ${fonts.body3};
  color: ${({ theme }) => theme.color.text16};
`;
