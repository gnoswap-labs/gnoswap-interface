import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const MyPositionCardWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  padding: 24px 36px;
  gap: 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  background-color: ${({ theme }) => theme.color.background06};
  ${media.tablet} {
    padding: 24px;
    border-radius: 10px;
    box-shadow: 8px 8px 20px 0px rgba(0, 0, 0, 0.2);
  }
  ${media.mobile} {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 290px;
    height: 434px;
    padding: 12px;
    gap: 16px;
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
        padding: 12px;
        gap: 8px;
        &:not(:first-of-type) {
          border-top: 1px solid ${({ theme }) => theme.color.border02};
        }
      }
      .symbol-text {
        ${fonts.body12};
        color: ${({ theme }) => theme.color.text10};
      }
      .content-text {
        ${fonts.body2};
        ${media.tablet} {
          ${fonts.body4};
        }
        ${media.mobile} {
          ${fonts.body8};
        }
        color: ${({ theme }) => theme.color.text02};
      }
    }
  }
`;
