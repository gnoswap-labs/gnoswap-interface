import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const FeeWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  padding: 16px;
  gap: 16px;
  border-top: 1px solid ${({ theme }) => theme.color.border02};
  align-self: stretch;
  ${fonts.body12};
  ${media.mobile} {
    ${fonts.p2};
  }
  ${media.mobile} {
    padding: 12px;
    gap: 8px;
    flex-direction: column;
  }

  .gray-text {
    color: ${({ theme }) => theme.color.text04};
  }
  .white-text {
    color: ${({ theme }) => theme.color.text03};
  }
  .received,
  .gas-fee,
  .price-impact {
    ${mixins.flexbox("row", "flex-start", "space-between")};
    width: 100%;
    align-self: stretch;
  }
  .auto-router {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    align-self: stretch;
    .auto-wrapper {
      ${mixins.flexbox("row", "center", "flex-start")};
      gap: 4px;
      h1 {
        color: ${({ theme }) => theme.color.text07};
      }
    }
    .router-icon {
      cursor: pointer;
      width: 16px;
      height: 16px;
      * {
        fill: ${({ theme }) => theme.color.icon03};
      }
    }
  }

  .router-box {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    padding: 12px;
    margin: 0px 16px 16px 16px;
    gap: 12px;
    align-self: stretch;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.color.border02};
    .row {
      ${mixins.flexbox("row", "center", "flex-start")};
      gap: 4px;
      align-self: stretch;
      .token-logo {
        width: 24px;
        height: 24px;
      }
      .left-box {
        ${mixins.flexbox("row", "center", "flex-start")};
        height: 28px;
        padding: 0px 4px 0px 2px;
        gap: 2px;
        border-radius: 4px;
        border: 1px solid ${({ theme }) => theme.color.border02};
        background: ${({ theme }) => theme.color.background02};

        .left-badge {
          ${mixins.flexbox("row", "center", "flex-end")};
          height: 24px;
          padding: 0px 6px;
          gap: 4px;
          border-radius: 4px;
          ${fonts.p3};
          color: ${({ theme }) => theme.color.text03};
          border: 1px solid ${({ theme }) => theme.color.border08};
          background: ${({ theme }) => theme.color.background05};
        }
        span {
          ${fonts.p3};
          color: ${({ theme }) => theme.color.text03};
        }
      }

      .vector {
        ${mixins.flexbox("row", "flex-start", "flex-start")};
      }
      .pair-fee {
        ${mixins.flexbox("row", "center", "center")};
        height: 28px;
        padding: 0px 8px;
        gap: 2px;
        border-radius: 4px;
        border: 1px solid ${({ theme }) => theme.color.border02};
        background: ${({ theme }) => theme.color.background02};
        h1 {
          ${fonts.p3};
          color: ${({ theme }) => theme.color.text03};
        }
        .coin-logo {
          ${mixins.flexbox("row", "flex-start", "flex-start")};

          .pair-logo {
            width: 16px;
            height: 16px;
          }
          .from {
            ${mixins.flexbox("row", "center", "center")};
            background-color: ${({ theme }) => theme.color.point};
            width: 16px;
            height: 16px;
            border-radius: 100%;
          }
          .to {
            ${mixins.flexbox("row", "center", "center")};
            background-color: ${({ theme }) => theme.color.icon09};
            width: 16px;
            height: 16px;
            border-radius: 100%;
            margin-left: -6px;
          }
        }
      }
    }
    .gas-description {
      ${fonts.body12}
      ${media.mobile} {
        ${fonts.p4}
      }
      color: ${({ theme }) => theme.color.text04};
    }
  }
`;

export const SwapDivider = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  height: 1px;
  align-self: stretch;
  background: ${({ theme }) => theme.color.border02};
`;
