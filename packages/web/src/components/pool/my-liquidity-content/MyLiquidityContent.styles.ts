import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const MyLiquidityContentWrapper = styled.div`
  ${mixins.flexbox("row", "flex-start", "flex-start")};
  width: 100%;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.background11};
  border: 1px solid ${({ theme }) => theme.color.border02};
  ${media.mobile} {
    flex-direction: column;
  }

  section {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    padding: 24px 36px;
    flex: 1 0 0;
    gap: 16px;
    &:not(:first-of-type) {
      border-left: 1px solid ${({ theme }) => theme.color.border02};
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
    @media (max-width: 1180px) and (min-width: 769px) {
      &:nth-of-type(3) {
        min-width: 300px;
      }
    }
    .button-claim {
      min-width: 86px;
    }
    .loading-button {
      width: 20px;
      height: 20px;
      background: conic-gradient(
        from 0deg at 50% 50.63%,
        #ffffff 0deg,
        #233dbd 360deg
      );
      &::before {
        width: 14.8px;
        height: 14.8px;
        background-color: ${({ theme }) => theme.color.background04Hover};
      }
    }
    .sub-content {
      ${mixins.flexbox("row", "center", "flex-start")};
      gap: 10px;
      min-height: 20px;
      ${media.tabletMiddle} {
        ${mixins.flexbox("row", "center", "flex-start")};
        &.flex-row {
          ${mixins.flexbox("row", "center", "flex-start")};
        }
      }
      ${media.mobile} {
        ${mixins.flexbox("row", "center", "flex-start")};
      }
    }
    .sub-content-detail {
      ${mixins.flexbox("row", "center", "flex-start")};
      gap: 4px;
      color: ${({ theme }) => theme.color.text10};
      .image-logo {
        width: 20px;
        height: 20px;
      }
    }
    .divider {
      height: 12px;
      border-left: 1px solid ${({ theme }) => theme.color.border02};
    }
    .total-daily {
      color: ${({ theme }) => theme.color.text04};
      ${mixins.flexbox("row", "center", "flex-start")};
      gap: 10px;
      height: 20px;
      ${fonts.body12}
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
  }

  h4 {
    ${fonts.body12};
    color: ${({ theme }) => theme.color.text04};
  }

  .has-tooltip {
    cursor: pointer;
    transition: color 0.3s ease;
    &:hover {
      color: ${({ theme }) => theme.color.text07};
    }
  }

  span.content-value {
    cursor: default;
    ${fonts.body2};
    font-weight: 700 !important;
    ${media.tablet} {
      ${fonts.body4}
    }
    ${media.mobile} {
      ${fonts.body8}
    }
    color: ${({ theme }) => theme.color.text02};
    &:hover:not(.disabled) {
      color: ${({ theme }) => theme.color.text07};
    }
  }

  .claim-wrap {
    ${mixins.flexbox("row", "center", "space-between")}
    width: 100%;
  }
  .mobile-wrap {
    ${mixins.flexbox("row", "center", "space-between")}
    width: 100%;
  }
  .column-wrap {
    ${mixins.flexbox("column", "flex-start", "flex-start")}
    gap: 8px;
  }
`;

export const RewardsContent = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
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
  .content {
    color: ${({ theme }) => theme.color.text02};
  }
  p {
    ${fonts.p4};
    color: ${({ theme }) => theme.color.text04};
  }
`;

export const TooltipDivider = styled.div`
  ${mixins.flexbox("column", "center", "flex-start")};
  height: 1px;
  width: 100%;
  background: ${({ theme }) => theme.color.border01};
`;

export const AmountDisplayWrapper = styled.div<{ $canHover: boolean }>`
  ${fonts.body11}
  .token-symbol {
    display: inline;
    @media (max-width: 1250px) {
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

  &:hover {
    ${({ $canHover, theme }) => {
      if ($canHover) {
        return `color: ${theme.color.text07}`;
      }
    }}
  }
`;

export const TokenAmountTooltipContentWrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")}
  gap: 4px;
  ${fonts.body12}
`;
