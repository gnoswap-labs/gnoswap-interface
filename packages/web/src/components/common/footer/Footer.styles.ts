import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const FooterWrapper = styled.footer`
  width: 100%;
  height: auto;
  background-color: ${({ theme }) => theme.color.background01};
  border-top: 1px solid ${({ theme }) => theme.color.border02};
`;

export const FooterInner = styled.div`
  ${mixins.flexbox("row", "flex-start", "space-between")}
  width: 100%;
  max-width: 1440px;
  height: 100%;
  padding: 60px 40px;
  margin: 0 auto;

  @media (max-width: 767px) {
    flex-direction: column;
  }
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
    color: ${({ theme }) => theme.color.text04};
    margin: 24px 0px;
    white-space: pre-wrap;
    width: 100%;
    height: 48px;
  }

  @media (max-width: 767px) {
    .footer-content {
      margin-bottom: 10px;
    }
  }
`;

export const SocialNav = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  width: 100%;
  gap: 24px;
`;

export const AnchorStyle = styled.a`
  ${fonts.body12}
  color: ${({ theme }) => theme.color.text04};
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
    fill: ${({ theme }) => theme.color.icon03};
  }
  :hover {
    color: ${({ theme }) => theme.color.text03};
    svg * {
      fill: ${({ theme }) => theme.color.icon07};
    }
  }
`;

export const RightSection = styled.div`
  ${mixins.flexbox("row", "flex-start", "space-between")};
  flex: 1;
  max-width: 776px;

  @media (max-width: 767px) {
    width: 100%;
    flex-wrap: wrap;
  }
`;

export const MenuSection = styled.section`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  strong {
    ${fonts.body11};
    color: ${({ theme }) => theme.color.text10};
  }

  @media (max-width: 767px) {
    max-width: 100%;
    width: 50%;
    margin-top: 20px;
  }
`;
