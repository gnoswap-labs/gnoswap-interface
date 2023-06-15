import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { Z_INDEX } from "@styles/zIndex";

export const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  z-index: ${Z_INDEX.fixed};
  width: 100%;
  height: 71px;
  background-color: ${({ theme }) => theme.colors.colorBlack};
  margin-bottom: auto;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray50};
`;

export const HeaderInner = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  position: relative;
  max-width: 1440px;
  width: 100%;
  height: 100%;
  padding: 0 40px;
  margin: 0 auto;
`;

export const LogoLink = styled.a`
  ${mixins.flexbox("row", "center", "center")};
  svg {
    width: 32px;
    height: 35px;
  }
`;

export const Navigation = styled.nav`
  ${mixins.positionCenter()};
  ul {
    ${mixins.flexbox("row", "center", "center")};
    gap: 48px;
  }
  li {
    transition: color 0.3s ease;
    ${mixins.flexbox("row", "center", "center")};
    ${fonts.body9};
    color: ${({ theme }) => theme.colors.gray40};
    &.selected,
    &:hover {
      color: ${({ theme }) => theme.colors.gray20};
    }
  }
`;

export const RightSection = styled.div`
  ${mixins.posTopCenterRight("40px")};
  ${mixins.flexbox("row", "center", "center")};
  gap: 16px;
`;
