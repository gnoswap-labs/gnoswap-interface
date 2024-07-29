import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

interface Props {
  type: "closed" | "none";
}

export const PositionCardAnchor = styled.div`
  position: relative;
  visibility: hidden;
  display: block;
  top: -87px;
  ${media.tablet} {
    top: -75px;
  }
  ${media.mobile} {
    display: none;
  }
`;

export const MyPositionCardWrapper = styled.div<Props>`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  padding: 24px 24px 0 24px;
  gap: 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border01};
  background-color: ${({ theme, type }) =>
    type === "closed" ? theme.color.background29 : theme.color.background03};
  ${media.tablet} {
    padding: 24px 24px 0 24px;
    border-radius: 10px;
  }
  ${media.mobile} {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: calc(100vw - 32px);
    padding: 12px 12px 0 12px;
    gap: 12px;
  }
  .box-title {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    gap: 8px;
    ${media.mobile} {
      gap: 12px;
    }
    .box-header {
      ${mixins.flexbox("row", "center", "space-between")};
      width: 100%;
      .box-left {
        ${mixins.flexbox("row", "center", "flex-start")};
        gap: 8px;
        .visible-badge {
          visibility: hidden;
        }
        .link-page {
          ${mixins.flexbox("row", "center", "flex-start")};
          gap: 8px;
          .icon-link {
            width: 22px;
            height: 22px;
            cursor: pointer;
            ${media.mobile} {
              width: 20px;
              height: 20px;
            }
            * {
              fill: ${({ theme }) => theme.color.icon03};
            }
          }
          .icon-link:hover {
            * {
              fill: ${({ theme }) => theme.color.icon07};
            }
          }
          > div {
            position: relative;
          }
        }
      }
      .mobile-container {
        ${mixins.flexbox("row", "flex-start", "flex-start")};
        gap: 8px;
      }

      .coin-info {
        ${mixins.flexbox("row", "flex-start", "flex-start")};
        .token-logo {
          width: 36px;
          height: 36px;
          ${media.tablet} {
            width: 30px;
            height: 30px;
          }
          ${media.mobile} {
            width: 24px;
            height: 24px;
          }
          &:not(:first-of-type) {
            margin-left: -6px;
          }
        }
      }
      .product-id {
        ${fonts.body5};
        ${media.mobile} {
          ${fonts.body7};
        }
        color: ${({ theme, type }) =>
          type !== "closed" ? theme.color.text02 : theme.color.text10};
      }
      .flex-button {
        ${mixins.flexbox("row", "center", "center")};
        gap: 8px;
        .disable-select {
          .icon-arrow {
            display: none;
          }
          .current {
            margin-right: 0px;
          }
          .select-item {
            display: none;
          }
        }
        .copy-button {
          padding: 10px 16px;
          span {
            ${fonts.p1}
          }
          background-color: ${({ theme }) => theme.color.background13};
          &:hover {
            background-color: ${({ theme }) => theme.color.backgroundGradient};
          }
        }
        ${media.mobile} {
          width: 100%;
          ${mixins.flexbox("column", "center", "center")};
          button {
            width: 100%;
          }
          > div {
            width: 100%;
            .selected-wrapper {
              justify-content: center;
            }
          }
        }
      }
      .select-box {
        width: auto;
        height: 36px;
        cursor: pointer;
        background: ${({ theme }) => theme.color.background13};
        border: 1px solid ${({ theme }) => theme.color.border18};
        &:hover {
          background: ${({ theme }) => theme.color.backgroundGradient};
        }
        .current {
          color: ${({ theme }) => theme.color.text14};
          ${fonts.p1}
          margin-right: 8px;
        }
        .select-item {
          left: auto;
          right: -1px;
          top: 43px;
          min-width: 165px;
          background: ${({ theme }) => theme.color.background01};
          box-shadow: ${({ theme }) => theme.color.shadow};
          .item-wrapper {
            margin-bottom: 4px;
            padding: 10px 16px;
            height: 37px;
            > div {
              font-weight: 500;
            }
            &:hover {
              background: ${({ theme }) => theme.color.background11};
              > div {
                color: ${({ theme }) => theme.color.text16};
              }
            }
            &:first-of-type {
              border-top-right-radius: 8px;
              border-top-left-radius: 8px;
            }
            &:last-of-type {
              border-bottom-right-radius: 8px;
              border-bottom-left-radius: 8px;
              margin-bottom: 0;
            }
          }
        }
        &.out-range {
          background: linear-gradient(270deg, #536cd7 0%, #233dbd 100%);
          .current {
            color: ${({ theme }) => theme.color.text27};
          }
          .item-wrapper {
            &:first-of-type {
              > div {
                color: ${({ theme }) => theme.color.text29};
              }
            }
          }
        }
      }
      ${media.mobile} {
        gap: 16px;
        ${mixins.flexbox("column", "flex-start", "flex-start")};
        .select-box {
          .select-item {
            position: absolute;
            height: fit-content;
            display: none;
            min-width: 165px;
          }
          .open {
            display: block;
          }
        }
      }
      @media (max-width: 360px) {
        ${mixins.flexbox("column", "flex-start", "flex-start")};
        gap: 16px;
        .select-box {
          position: relative;
          width: 100%;
          .selected-wrapper {
            ${mixins.flexbox("row", "center", "center")};
          }
          .select-item {
            position: absolute;
            height: fit-content;
            display: none;
            width: 100%;
            max-width: 303px;
            min-width: auto;
            left: 0;
            right: auto;
          }
          .open {
            display: block;
          }
        }
      }
    }
    .min-max {
      ${mixins.flexbox("row", "flex-start", "flex-start")};
      gap: 8px;
      ${media.mobile} {
        flex-direction: column;
        gap: 4px;
      }
      ${fonts.body12};
      .symbol-text {
        color: ${({ theme }) => theme.color.text04};
      }
      .token-text {
        color: ${({ theme }) => theme.color.text10};
      }
      .arrow-text {
        color: ${({ theme }) => theme.color.text04};
        ${media.mobile} {
          transform: rotate(90deg);
        }
      }
      .min-mobile,
      .max-mobile {
        ${mixins.flexbox("row", "flex-start", "flex-start")};
        gap: 8px;
      }
    }
  }
  .info-wrap {
    ${mixins.flexbox("row", "center", "flex-start")};
    width: 100%;
    gap: 16px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.color.border02};
    ${media.mobile} {
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      gap: 12px;
    }
    .info-box {
      ${mixins.flexbox("column", "flex-start", "flex-start")};
      width: 100%;
      padding: 16px;
      gap: 16px;
      &:not(:first-of-type) {
        border-left: 1px solid ${({ theme }) => theme.color.border02};
      }
      ${media.tablet} {
        gap: 16px;
      }
      ${media.mobile} {
        padding: 12px 12px 0 12px;
        gap: 8px;
        &:not(:first-of-type) {
          border-top: 1px solid ${({ theme }) => theme.color.border02};
        }
        border-left: none !important;
        &:last-of-type {
          padding: 12px;
        }
      }
      .symbol-text {
        ${fonts.body12};
        color: ${({ theme }) => theme.color.text04};
      }
      .content-text {
        ${mixins.flexbox("row", "center", "flex-start")};
        ${fonts.body2};
        font-weight: 700 !important;
        ${media.tablet} {
          ${fonts.body4};
          svg {
            height: 25px;
            width: 25px;
          }
        }
        ${media.mobile} {
          ${fonts.body8};
        }
        cursor: default;
        transition: color 0.3s ease;
        &:hover {
          color: ${({ theme }) => theme.color.text07};
        }
        color: ${({ theme, type }) =>
          type !== "closed" ? theme.color.text02 : theme.color.text10};
        &.disabled {
          pointer-events: none;
        }
      }
    }
  }
  .position-wrapper-chart {
    ${mixins.flexbox("column", "center", "flex-start")};
    background-color: ${({ theme }) => theme.color.background20};
    border: 1px solid ${({ theme }) => theme.color.border14};
    border-radius: 10px;
    padding: 16px 48px;
    width: 100%;
    gap: 16px;
    .position-header {
      ${mixins.flexbox("column", "center", "center")};
      width: 100%;
      gap: 8px;
      color: ${({ theme }) => theme.color.text04};
      ${fonts.body12}
      position: relative;
      .range-badge {
        position: absolute;
        top: 14.5px;
        right: 0;
      }
    }
    .swap-price {
      ${mixins.flexbox("row", "center", "center")};
      ${fonts.body12}
      gap: 4px;
      text-align: center;
      color: ${({ theme }) => theme.color.text10};
      .icon-wrapper {
        ${mixins.flexbox("row", "center", "center")};
      }
      svg {
        cursor: pointer;
        * {
          fill: ${({ theme }) => theme.color.icon03};
        }
      }
      svg:hover * {
        fill: ${({ theme }) => theme.color.icon07};
      }
      .image-logo {
        width: 20px;
        height: 20px;
      }
    }
    .divider {
      margin: 0 6px;
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
      .positive {
        color: ${({ theme }) => theme.color.green01};
      }
      .negative {
        color: ${({ theme }) => theme.color.red01};
      }
      ${media.mobile} {
        ${mixins.flexbox("column", "center", "center")};
        > div {
        }
      }
    }
    ${media.mobile} {
      padding: 12px;
      .position-header {
        ${mixins.flexbox("column", "center", "center")};
        gap: 8px;
        .range-badge {
          top: 0;
        }
      }
    }
  }
`;

export const TooltipContent = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  gap: 8px;
  min-width: 268px;
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

export const RewardsContent = styled.div`
  ${mixins.flexbox("column", "flex-start", "space-between")};
  gap: 8px;
  width: 268px;
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
  .note {
    color: ${({ theme }) => theme.color.text04};
    ${fonts.p4}
  }
  .content {
    color: ${({ theme }) => theme.color.text02};
  }
  p {
    ${fonts.p4};
    color: ${({ theme }) => theme.color.text04};
  }
  .divider {
    width: 100%;
    border-top: 1px solid ${({ theme }) => theme.color.border01};
  }
`;

export const TooltipDivider = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  height: 1px;
  width: 100%;
  background: ${({ theme }) => theme.color.border01};
`;

export const ToolTipContentWrapper = styled.div`
  min-width: 251px;
  max-width: 400px;
  ${fonts.body12}
  color: ${({ theme }) => theme.color.text02};
`;

export const ManageItem = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  ${fonts.p2}
  color: ${({ theme }) => theme.color.text22};
`;

export const CopyTooltip = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  position: absolute;
  top: -65px;
  left: -45px;
  z-index: 2;
  .box {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 115px;
    padding: 16px;
    gap: 8px;
    flex-shrink: 0;
    border-radius: 8px;
    ${fonts.body12};
    color: ${({ theme }) => theme.color.text02};
    background-color: ${({ theme }) => theme.color.background02};
    & > span {
      white-space: nowrap;
    }
  }
  .dark-shadow {
    box-shadow: 10px 14px 60px rgba(0, 0, 0, 0.4);
  }
  .light-shadow {
    box-shadow: 10px 14px 48px 0px rgba(0, 0, 0, 0.12);
  }
  .polygon-icon * {
    fill: ${({ theme }) => theme.color.background02};
  }

  ${media.mobile} {
    ${mixins.flexbox("row", "center", "flex-start")};
    top: -8px;
    left: 20px;
    .box {
      padding: 12px;
    }

    & .rotate-90 {
      transform: rotate(90deg);
      margin-right: -10px;
    }
  }
`;

export const UrlCopiedWrapper = styled.span`
  ${fonts.body12};
  color: ${({ theme }) => theme.color.text02};
`;
