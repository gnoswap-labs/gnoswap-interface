import styled from "@emotion/styled";
import mixins from "@/styles/mixins";

export const FooterWrapper = styled.footer`
  width: 100%;
  height: 308px;
  background-color: ${({ theme }) => theme.colors.colorBlack};
  margin-top: auto;
`;

export const FooterInner = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")}
  max-width: 1440px;
  height: 100%;
  padding: 0 40px;
  margin: 0 auto;
`;

export const LeftSection = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")}
  width: 230px;
  .footer-logo {
    width: 32px;
    height: 35px;
  }
  .footer-content {
    ${({ theme }) => theme.fonts.p2}
    color: ${({ theme }) => theme.colors.gray40};
    margin: 25px 0px 26px;
    white-space: pre-wrap;
  }
`;

export const SocialNav = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  width: 100%;
`;

export const AnchorStyle = styled.a`
  ${({ theme }) => theme.fonts.body12}
  color: ${({ theme }) => theme.colors.gray40};
  margin-top: 16px;
  svg * {
    fill: ${({ theme }) => theme.colors.gray40};
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
    ${({ theme }) => theme.fonts.body11};
    color: ${({ theme }) => theme.colors.gray30};
  }
`;
