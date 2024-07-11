import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const ContentWrapper = styled.div`
  background-color: ${({ theme }) => theme.color.backgroundOpacity9};
  width: 100%;
  border-radius: 8px;
  .chart-chart-container {
    border-width: 0 1px 1px 1px;
    border-style: solid;
    border-color: ${({ theme }) => theme.color.border14};
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
  .position-wrapper-chart {
    ${mixins.flexbox("column", "center", "flex-start")};
    border: 1px solid ${({ theme }) => theme.color.border14};
    background-color: ${({ theme }) => theme.color.background28};
    border-radius: 10px;
    padding: 16px 48px;
    margin: 16px 24px 24px 24px;
    gap: 16px;
    .position-header {
      ${mixins.flexbox("column", "center", "space-between")};
      width: 100%;
      gap: 8px;
      color: ${({ theme }) => theme.color.text04};
      ${fonts.body12}
      position: relative;
    }
    .swap-price {
      height: 20px;
      ${mixins.flexbox("row", "center", "center")};
      ${fonts.body11}
      text-align: center;
      color: ${({ theme }) => theme.color.text10};
      svg {
        cursor: pointer;
        * {
          fill: ${({ theme }) => theme.color.icon03};
        }
      }
      svg:hover * {
        fill: ${({ theme }) => theme.color.icon07};
      }
      .left {
        gap: 4px;
        position: absolute;
        ${mixins.flexbox("row", "center", "center")};
        transform: translateX(calc(-100% - 10px));
        left: 50%;
      }
      .right {
        gap: 4px;
        position: absolute;
        ${mixins.flexbox("row", "center", "center")};
        left: calc(50% + 10px);
      }
    }
    .convert-price {
      ${mixins.flexbox("row", "center", "center")};
      color: ${({ theme }) => theme.color.text04};
      ${fonts.body12}
      svg {
        width: 16px;
        height: 16px;
        * {
          fill: ${({ theme }) => theme.color.icon03};
        }
      }
      > div {
        ${mixins.flexbox("row", "center", "center")};
      }
      ${media.mobile} {
        ${mixins.flexbox("column", "center", "center")};
        > div {
        }
      }
    }
    .image-logo {
      width: 20px;
    }
    .divider {
      margin: 0 6px;
    }
    @media (max-width: 767px) {
      margin: 16px 12px;
      padding: 16px 12px;
      .position-header {
        ${mixins.flexbox("column", "center", "center")};
        gap: 8px;
        > div:first-of-type {
        }
      }
    }
  }
`;

export const PoolPairInfoContentWrapper = styled.div`
  ${mixins.flexbox("row", "flex-start", "flex-start")};
  width: 100%;
  ${fonts.body12};
  color: ${({ theme }) => theme.color.text04};
  border: 1px solid ${({ theme }) => theme.color.border02};
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  ${media.mobile} {
    flex-direction: column;
  }

  section {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    padding: 24px 36px;
    gap: 16px;
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
      &.can-hover:hover {
        color: ${({ theme }) => theme.color.text07};
      }
      <<<<<<< HEAD =======>>>>>>>develop > span {
        ${fonts.body11}
        .token-symbol {
          display: inline;
          @media (max-width: 1222px) {
            display: none;
          }
          ${media.tablet} {
            display: none;
          }
          ${media.tabletMiddle} {
            display: none;
          }
          ${media.mobile} {
            display: none;
          }
        }
        .wrap-text {
          @media (max-width: 1343px) {
            display: none;
          }
        }
        .token-percent {
          display: inline;
          ${media.tablet} {
            display: none;
          }
          ${media.tabletMiddle} {
            display: none;
          }
          ${media.mobile} {
            display: inline;
          }
        }
      }
    }
    .divider {
      height: 12px;
      border-left: 1px solid ${({ theme }) => theme.color.border02};
    }
    .wrapper-value {
      ${mixins.flexbox("row", "center", "flex-start")};
      gap: 8px;
      > div {
        ${mixins.flexbox("row", "center", "flex-start")};
        margin-top: 8px;
        gap: 4px;
        strong {
          font-weight: 700 !important;
        }
        span {
          font-weight: 700 !important;
        }
        svg {
          width: 6px;
        }
        ${media.mobile} {
          margin-top: 6px;
        }
      }
    }
    .apr-content {
      &:hover {
        color: ${({ theme }) => theme.color.text07};
        cursor: default;
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
    min-height: 20px;
    <<<<<<< HEAD &.flex-row {
      white-space: nowrap;
    }

    =======>>>>>>>develop ${media.tabletMiddle} {
      ${mixins.flexbox("row", "center", "flex-start")};
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
    height: 20px;

    .content-wrap {
      ${mixins.flexbox("", "center", "flex-start")};
      gap: 8px;
      .apr-value {
        ${fonts.body11}
        color: ${({ theme }) => theme.color.text10};
      }
    }
    ${media.tablet} {
      ${mixins.flexbox("column", "flex-start", "flex-start")};
      .content-wrap {
        &.content-reward {
          display: none;
        }
      }
    }
    ${media.tabletMiddle} {
      ${mixins.flexbox("column", "flex-start", "flex-start")};
      .content-wrap {
        &.content-reward {
          display: none;
        }
      }
    }
    ${media.mobile} {
      ${mixins.flexbox("row", "center", "flex-start")};
      .content-wrap {
        &.content-reward {
          display: flex;
        }
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
    font-weight: 700 !important;
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
  ${media.mobile} {
    ${mixins.flexbox("column", "center", "flex-start")};
  }
`;

export const LoadingChart = styled.div`
  ${mixins.flexbox("row", "center", "center")}
  width: 100%;
  height: 150px;
  background-color: transparent;
  border-radius: 8px;
  > div {
    width: 48px;
    height: 48px;
    &::before {
      background-color: ${({ theme }) => theme.color.background01};
      width: 38px;
      height: 38px;
      box-shadow: none;
    }
    &::after {
      ${mixins.positionCenter()};
      content: "";
      border-radius: 50%;
      width: 38px;
      height: 38px;
      background-color: ${({ theme }) => theme.color.background15};
    }
  }
`;

export const TokenAmountTooltipContentWrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")}
  gap: 4px;
`;
