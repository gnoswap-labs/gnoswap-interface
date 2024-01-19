import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const PoolPairInfoContentWrapper = styled.div`
  ${mixins.flexbox("row", "flex-start", "flex-start")};
  width: 100%;
  ${fonts.body12};
  border-radius: 8px;
  color: ${({ theme }) => theme.color.text04};
  border: 1px solid ${({ theme }) => theme.color.border02};
  background-color: ${({ theme }) => theme.color.background11};
  ${media.mobile} {
    flex-direction: column;
  }

  section {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    padding: 24px 36px;
    gap: 10px;
    flex: 1 0 0;
    &:not(:first-of-type) {
      border-left: 1px solid ${({ theme }) => theme.color.border02};
    }
    .image-logo {
      width: 20px;
      height: 20px;
    }
    .section-image {
      ${mixins.flexbox("row", "center", "flex-start")};
      gap: 4px;
      color: ${({ theme }) => theme.color.text10};
      > span {
        > span {
          display: inline;
          ${media.tablet} {
            display: none;
          }
          ${media.tabletMiddle} {
            display: inline;
          }
        }
      }
    }
    .divider {
      height: 12px;
      border-left: 1px solid ${({ theme }) => theme.color.border02};
      ${media.tabletMiddle} {
        display: none;
      }
    }
    .wrapper-value {
      ${mixins.flexbox("row", "center", "flex-start")};
      gap: 8px;
      > div {
        ${mixins.flexbox("row", "center", "flex-start")};
        margin-top: 8px;
        gap: 4px;
        span {
          font-weight: 700;
        }
        svg {
          width: 6px;
        }
      }
    }
    ${media.tablet} {
      padding: 24px;
    }
    ${media.mobile} {
      padding: 12px;
      gap: 8px;
      &:not(:first-of-type) {
        border-top: 1px solid ${({ theme }) => theme.color.border02};
      }
      border-left: none !important;
    }
  }

  .negative {
    color: ${({ theme }) => theme.color.red01};
  }
  .positive {
    color: ${({ theme }) => theme.color.green01};
  }
  .section-info {
    ${mixins.flexbox("row", "center", "flex-start")};
    gap: 10px;
    ${media.tabletMiddle} {
      ${mixins.flexbox("column", "center", "flex-start")};
      &.flex-row {
        ${mixins.flexbox("row", "center", "flex-start")};
      }
    }
    ${media.mobile} {
      ${mixins.flexbox("row", "center", "flex-start")};
    }
  }

  .apr-info {
    ${mixins.flexbox("row", "center", "flex-start")};
    gap: 10px;
    ${media.tabletMiddle} {
      ${mixins.flexbox("column", "flex-start", "flex-start")};
    }
    ${media.mobile} {
      ${mixins.flexbox("row", "center", "flex-start")};
    }
    .content-wrap {
      ${mixins.flexbox("", "center", "flex-start")};
      gap: 8px;
      .apr-value {
        color: ${({ theme }) => theme.color.text10};
      }
    }
  }

  .has-tooltip {
    cursor: default;
    transition: color 0.3s ease;
    &:hover {
      color: ${({ theme }) => theme.color.text07};
    }
  }

  strong {
    ${mixins.flexbox("row", "center", "flex-start")};
    ${fonts.body2};
    ${media.tablet} {
      ${fonts.body4};
    }
    ${media.mobile} {
      ${fonts.body7};
      svg {
        height: 25px;
        width: 25px;
      }
    }
    color: ${({ theme }) => theme.color.text02};

  }
`;

export const TooltipContent = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  gap: 8px;
  ${fonts.body12};
  ${media.mobile} {
    gap: 4px;
    ${fonts.p2};
  }
  .list {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    padding: 4px 0px;
    .coin-info {
      ${mixins.flexbox("row", "center", "flex-start")};
      width: 170px;
      gap: 8px;
      flex-shrink: 0;
      .token-logo {
        width: 20px;
        height: 20px;
      }
    }
  }
  .title {
    color: ${({ theme }) => theme.color.text04};
  }
  .content {
    color: ${({ theme }) => theme.color.text02};
  }
`;

export const AprDivider = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  width: 1px;
  height: 12px;
  background: ${({ theme }) => theme.color.background12};
  ${media.tabletMiddle} {
    display: none;
  }
  ${media.mobile} {
    ${mixins.flexbox("column", "center", "flex-start")};
  }
`;
