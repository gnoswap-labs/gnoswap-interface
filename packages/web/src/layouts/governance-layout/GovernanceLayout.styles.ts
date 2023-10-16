import mixins from "@styles/mixins";
import styled from "@emotion/styled";
import { fonts } from "@constants/font.constant";
import { ContainerWidth, media } from "@styles/media";

export const GovernanceLayoutWrapper = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  width: 100%;
  background-color: ${({ theme }) => theme.color.background01};

  .governance-section {
    ${mixins.flexbox("column", "center", "flex-start")};
    max-width: ${ContainerWidth.WEB_SECTION_CONTAINER};
    width: 100%;
    padding: 100px 0px;
    gap: 36px;
    ${media.tablet} {
      max-width: ${ContainerWidth.TABLET_CONTAINER};
      padding: 60px 0px;
      gap: 24px;
    }
    ${media.mobile} {
      max-width: ${ContainerWidth.MOBILE_CONTAINER};
      width: 90%;
      padding: 24px 0px 48px 0px;
      gap: 12px;
    }
  }

  .title-container {
    ${mixins.flexbox("row", "baseline", "flex-start")};
    max-width: ${ContainerWidth.WEB_CONTAINER};
    width: 100%;
    padding: 0px 40px 0px 40px;
    gap: 24px;
    ${media.tablet} {
      gap: 16px;
    }
    ${media.mobile} {
      padding: 0px 0px 0px 0px;
      gap: 12px;
    }
  }

  .title {
    ${mixins.flexbox("column", "flex-end", "center")};
    ${fonts.h3};
    color: ${({ theme }) => theme.color.text02};
    @media (max-width: 968px) {
      ${fonts.h4};
    }
    ${media.mobile} {
      ${fonts.h5};
    }
  }
  .sub-title {
    ${mixins.flexbox("row", "center", "center")};
    ${fonts.body11};
    gap: 4px;
    cursor: pointer;
    color: ${({ theme }) => theme.color.text04};
    ${media.mobile} {
      ${fonts.p3};
    }
  }

  .link-icon {
    width: 16px;
    height: 16px;
    * {
      fill: ${({ theme }) => theme.color.text07};
    }
  }

  .summary-container {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    max-width: ${ContainerWidth.WEB_CONTAINER};
    width: 100%;
    padding: 0px 40px;
    gap: 22px;
    @media (max-width: 968px) {
      gap: 16px;
    }
    ${media.mobile} {
      padding: 12px 0px 24px 0px;
    }
  }
`;

export const LinkButton = styled.div`
  ${mixins.flexbox("row", "center", "center")};
  width: 100%;
  ${fonts.body11};
  gap: 4px;
  color: ${({ theme }) => theme.color.text04};
  ${media.mobile} {
    ${fonts.p3};
  }
  a {
    ${mixins.flexbox("row", "center", "center")};
    color: ${({ theme }) => theme.color.text07};
  }
  svg {
    width: 16px;
    height: 16px;
    * {
      fill: ${({ theme }) => theme.color.text07};
    }
  }
  ${media.mobile} {
    display: block;
    text-align: center;
  }
`;
