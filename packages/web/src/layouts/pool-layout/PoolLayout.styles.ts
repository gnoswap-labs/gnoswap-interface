import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media, ContainerWidth } from "@styles/media";
import mixins from "@styles/mixins";

export const PoolLayoutWrapper = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  width: 100%;
  background-color: ${({ theme }) => theme.color.background01};
  .pool-section {
    ${mixins.flexbox("column", "center", "flex-start")};
    max-width: ${ContainerWidth.WEB_SECTION_CONTAINER};
    width: 100%;
    padding: 100px 0px;
    gap: 80px;

    ${media.tablet} {
      max-width: ${ContainerWidth.TABLET_CONTAINER};
      padding: 60px 0px;
      gap: 60px;
    }
    ${media.mobile} {
      max-width: ${ContainerWidth.MOBILE_CONTAINER};
      width: 100%;
      padding: 24px 16px 48px 16px;
      gap: 32px;
    }
  }

  .summury-container {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    max-width: ${ContainerWidth.WEB_CONTAINER};
    width: 100%;
    padding: 0px 40px;
    gap: 36px;

    ${media.tablet} {
      align-self: stretch;
    }
    ${media.mobile} {
      padding: 0px;
      gap: 16px;
    }
  }

  // .anchor-position-container {
  //   position: relative;
  //   visibility: hidden;
  //   display: block;
  //   top: -97px;
  //   ${media.tablet} {
  //     top: -75px;
  //   }
  //   ${media.mobile} {
  //     display: none;
  //   }
  // }
  .positions-container {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    max-width: ${ContainerWidth.WEB_CONTAINER};
    width: 100%;
    padding: 0px 40px;
    gap: 16px;

    ${media.tablet} {
      gap: 24px;
      align-self: stretch;
    }
    ${media.mobile} {
      padding: 0px;
      gap: 36px;
    }
  }

  .staking-container {
    ${mixins.flexbox("column", "center", "flex-start")};
    max-width: ${ContainerWidth.WEB_CONTAINER};
    width: 100%;
    padding: 0px 40px;
    gap: 36px;

    ${media.tablet} {
      align-self: stretch;
    }
    ${media.mobile} {
      padding: 0px;
    }

    .button {
      ${mixins.flexbox("row", "center", "flex-start")};
      @media (max-width: 400px) {
        flex-direction: column;
        align-self: stretch;
      }

      span {
        ${fonts.body11}
        color: ${({ theme }) => theme.color.text04};
      }

      .pointer-wrap {
        ${mixins.flexbox("row", "center", "center")};
        cursor: pointer;
        span {
          ${fonts.body11}
          color: ${({ theme }) => theme.color.text07};
        }
        &:hover {
          span {
            color: ${({ theme }) => theme.color.text08};
          }
          svg {
            * {
              fill: ${({ theme }) => theme.color.icon14};
            }
          }
        }
        .arrow-icon {
          width: 16px;
          height: 16px;
          cursor: pointer;
          * {
            fill: ${({ theme }) => theme.color.icon06};
          }
        }
      }
    }
  }
`;

interface Props {
  height: number;
  mobileHeight: number;
  width?: number;
}

export const SkeletonEarnDetailWrapper = styled.div<Props>`
  max-width: 100%;
  width: ${({ width }) => {
    return width ? `${width}px` : "auto";
  }};
  ${mixins.flexbox("row", "center", "flex-start")}
  height: ${({ height }) => {
    return `${height}px`;
  }};
  ${media.tablet} {
    height: ${({ height }) => {
      return `${height}px`;
    }};
  }
  ${media.mobile} {
    height: ${({ mobileHeight }) => {
      return `${mobileHeight}px`;
    }};
  }
  > span {
    display: block;
    max-width: 100%;

  }
`;
