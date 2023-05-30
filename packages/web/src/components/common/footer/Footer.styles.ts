import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const FooterWrapper = styled.footer`
  width: 100%;
  height: 308px;
  background-color: ${({ theme }) => theme.colors.colorBlack};
  /* margin-top: auto; */
  border-top: 1px solid ${({ theme }) => theme.colors.gray50};
`;

export const FooterInner = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")}
  width: 100%;
  max-width: 1440px;
  height: 100%;
  padding: 0 40px;
  margin: 0 auto;
`;

export const LeftSection = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")}
  width: 254px;
  .footer-logo {
    width: 32px;
    height: 35px;
  }
  .footer-content {
    ${fonts.p2}
    color: ${({ theme }) => theme.colors.gray40};
    margin: 24px 0px;
    white-space: pre-wrap;
    width: 100%;
    height: 48px;
  }
`;

export const SocialNav = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  width: 100%;
  gap: 24px;
`;

export const AnchorStyle = styled.a`
  ${fonts.body12}
  color: ${({ theme }) => theme.colors.gray40};
  &,
  svg * {
    transition: all 0.3s ease;
  }
  &:not(.list-menu) {
    width: 24px;
    height: 24px;
  }
  &.list-menu {
    margin-top: 16px;
  }
  svg * {
    fill: ${({ theme }) => theme.colors.gray40};
  }
  :hover {
    color: ${({ theme }) => theme.colors.gray20};
    svg * {
      fill: ${({ theme }) => theme.colors.gray10};
    }
  }
`;

export const RightSection = styled.div`
  ${mixins.flexbox("row", "flex-start", "space-between")};
  flex: 1;
  margin-left: 330px;
`;

export const MenuSection = styled.section`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  strong {
    ${fonts.body11};
    color: ${({ theme }) => theme.colors.gray30};
  }
`;
