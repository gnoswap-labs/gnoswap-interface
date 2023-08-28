import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { ContainerWidth, media } from "@styles/media";
import mixins from "@styles/mixins";

export const FooterWrapper = styled.footer`
  ${mixins.flexbox("column", "center", "flex-start")}
  width: 100%;
  min-width: 360px;
  padding: 60px 0px;
  gap: 10px;
  background-color: ${({ theme }) => theme.color.background01};
  border-top: 1px solid ${({ theme }) => theme.color.border02};
  ${media.mobile} {
    padding-top: 36px;
  }
`;

export const FooterContainer = styled.div`
  ${mixins.flexbox("row", "flex-start", "space-between")}
  max-width: ${ContainerWidth.WEB_CONTAINER};
  width: 100%;
  padding: 0px 40px;
  ${media.tablet} {
    max-width: ${ContainerWidth.TABLET_CONTAINER};
  }
  ${media.mobile} {
    flex-direction: column;
    max-width: ${ContainerWidth.MOBILE_CONTAINER};
    width: 90%;
    padding: 0px;
    gap: 36px;
  }
`;

export const FirstSection = styled.div`
  ${mixins.flexbox("column", "flex-start", "center")}
  max-width: 254px;
  width: 100%;
  gap: 24px;

  .footer-main-logo {
    width: 31.501px;
    height: 36px;
    ${media.mobile} {
      width: 28.001px;
      height: 32px;
    }
  }
  .footer-content {
    ${fonts.p2}
    color: ${({ theme }) => theme.color.text04};
    white-space: pre-wrap;
    width: 100%;
  }

  ${media.mobile} {
    max-width: 736px;
    gap: 8px;
  }
`;

export const SocialNav = styled.div`
  ${mixins.flexbox("row", "flex-start", "flex-start")};
  width: 100%;
  gap: 24px;
`;

export const AnchorStyle = styled.a`
  ${fonts.body12}
  color: ${({ theme }) => theme.color.text04};
  white-space: nowrap;
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
    ${media.mobile} {
      ${fonts.p2}
      margin-top: 8px;
    }
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

export const SecondSection = styled.div`
  display: grid;
  max-width: 802px;
  width: 100%;
  column-gap: 90px;
  grid-template-columns: repeat(5, auto);
  ${media.tablet} {
    max-width: 682px;
    column-gap: 18px;
  }
  ${media.mobile} {
    row-gap: 36px;
    column-gap: 36px;
    grid-template-columns: repeat(auto-fill, 100px);
  }
`;

export const MenuSection = styled.section`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  strong {
    ${fonts.body11};
    color: ${({ theme }) => theme.color.text10};
  }
`;
