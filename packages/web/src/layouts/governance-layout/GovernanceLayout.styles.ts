import mixins from "@styles/mixins";
import styled from "@emotion/styled";
import { fonts } from "@constants/font.constant";
import { ContainerWidth, media } from "@styles/media";

export const GovernanceLayoutWrapper = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  width: 100%;
  background-color: ${({ theme }) => theme.color.background01};
  color: ${({ theme }) => theme.color.text10};
  .governance-section {
    ${mixins.flexbox("column", "center", "flex-start")};
    max-width: ${ContainerWidth.WEB_SECTION_CONTAINER};
    width: 100%;
    padding-top: 100px;
    gap: 36px;
    @media (max-width: 1180px) {
      max-width: ${ContainerWidth.TABLET_CONTAINER};
      padding-top: 60px;
      gap: 24px;
    }
    ${media.mobile} {
      max-width: ${ContainerWidth.MOBILE_CONTAINER};
      width: 100%;
      padding: 24px 16px 48px 16px;
      gap: 12px;
    }
  }

  .title-container {
    position: relative;
    max-width: ${ContainerWidth.WEB_CONTAINER};
    width: 100%;
    padding: 0px 40px 0px 40px;
    ${media.tablet} {
      gap: 16px;
    }
    ${media.mobile} {
      padding: 0px 0px 0px 0px;
      gap: 12px;
    }
  }

  .title {
    display: inline-block;
    ${fonts.h3};
    color: ${({ theme }) => theme.color.text02};
    @media (max-width: 1180px) {
      ${fonts.h4};
    }
    ${media.mobile} {
      ${fonts.h5};
    }
  }
  .sub-title-layout {
    position: absolute;
    ${mixins.flexbox("row", "center", "center", false)};
    ${fonts.body11};
    gap: 4px;
    margin-left: 20px;
    bottom: 7px;
    top: 19px;
    cursor: pointer;
    p {
      display: inline-block;
    }
    color: ${({ theme }) => theme.color.text04};
    svg * {
      fill: ${({ theme }) => theme.color.icon03};
    }
    &:hover {
      color: ${({ theme }) => theme.color.text03};
      svg {
        * {
          fill: ${({ theme }) => theme.color.icon07};
        }
      }
    }
    @media (max-width: 1180px) {
      margin-left: 12px;
      bottom: 6px;
      top: 15px;
    }
    ${media.mobile} {
      margin-left: 10px;
      bottom: 2px;
      top: 9px;
    }
  }

  .link-icon {
    width: 16px;
    height: 16px;
    * {
      fill: ${({ theme }) => theme.color.text07};
    }
  }

  .list-wrapper {
    margin-top: 60px;
    width: 100%;
    padding-top: 100px;
    padding-bottom: 48px;
    background: linear-gradient(
      180deg,
      rgba(20, 26, 41, 0.5) 0%,
      rgba(20, 26, 41, 0) 100%
    );

    ${media.tablet} {
      padding-top: 63.5px;
      margin-top: 40px;
    }

    ${media.mobile} {
      padding-top: 24px;
      margin-top: 24px;
    }
  }

  .summary-container {
    margin: 0 auto;
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    max-width: ${ContainerWidth.WEB_CONTAINER};
    width: 100%;
    padding: 0px 40px;
    gap: 22px;
    @media (max-width: 1180px) {
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
    &:hover {
      color: ${({ theme }) => theme.color.text08};
      svg {
        * {
          fill: ${({ theme }) => theme.color.icon14};
        }
      }
    }
  }
  svg {
    width: 16px;
    height: 16px;
    * {
      fill: ${({ theme }) => theme.color.text07};
    }
  }
  ${media.mobile} {
    margin-bottom: 8px;
    flex-wrap: wrap;
  }
`;
