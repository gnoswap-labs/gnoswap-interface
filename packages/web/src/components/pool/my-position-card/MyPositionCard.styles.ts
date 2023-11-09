import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

interface Props {
  type: boolean;
}

export const MyPositionCardWrapper = styled.div<Props>`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  padding: 24px 36px;
  gap: 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border01};
  background-color: ${({ theme }) => theme.color.background03};
  ${media.tablet} {
    padding: 24px;
    border-radius: 10px;
  }
  ${media.mobile} {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 290px;
    padding: 12px;
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
      ${media.mobile} {
        align-items: flex-start;
      }
      .box-left {
        ${mixins.flexbox("row", "center", "flex-start")};
        gap: 8px;
        ${media.mobile} {
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
        }
        .visible-badge {
          visibility: hidden; 
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
        color: ${({ theme }) => theme.color.text02};
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
      gap: 24px;
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
        ${fonts.body2};
        ${media.tablet} {
          ${fonts.body4};
        }
        ${media.mobile} {
          ${fonts.body8};
        }
        cursor: pointer;
        transition: color 0.3s ease;
        &:hover {
          color: ${({ theme }) => theme.color.text07};
        }
        color: ${({ theme }) => theme.color.text02};
      }
    }
  }
`;

export const TooltipContent = styled.div`
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
`;


export const RewardsContent = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  gap: 8px;
  width: 300px;
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
