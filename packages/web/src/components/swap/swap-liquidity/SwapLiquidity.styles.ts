import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const SwapLiquidityWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  padding: 24px 0px;
  gap: 24px;
  ${media.mobile} {
    padding: 16px 0px;
    gap: 16px;
    align-self: stretch;
  }

  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  background: ${({ theme }) => theme.color.background01};
  box-shadow: 8px 8px 20px 0px rgba(0, 0, 0, 0.08);

  .box-header {
    ${mixins.flexbox("row", "center", "flex-start")};
    width: 100%;
    padding: 0px 24px;
    gap: 8px;
    color: ${({ theme }) => theme.color.text02};
    ${fonts.body7};
    ${media.mobile} {
      padding: 0px 16px;
    }

    .coin-pair {
      ${mixins.flexbox("row", "flex-start", "flex-start")};

      .gnos-image-wrapper {
        ${mixins.flexbox("row", "center", "center")};
        background-color: ${({ theme }) => theme.color.point};
        width: 24px;
        height: 24px;
        border-radius: 100%;
      }
      .gnot-image-wrapper {
        ${mixins.flexbox("row", "center", "center")};
        background-color: ${({ theme }) => theme.color.icon09};
        width: 24px;
        height: 24px;
        border-radius: 100%;
        margin-left: -6px;
      }
      .coin-logo {
        ${mixins.flexbox("row", "center", "flex-start")};
        width: 14.25px;
        height: 14.25px;
        flex-shrink: 0;
      }
    }
  }

  .list-wrap {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    padding: 0px 24px;
    gap: 16px;
    ${media.mobile} {
      padding: 0px 16px;
    }
    ${fonts.body12}
    color: ${({ theme }) => theme.color.text04};
  }

  .liquidity-list {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    color: ${({ theme }) => theme.color.text02};
    width: 100%;
    gap: 4px;
    align-self: stretch;
    ${fonts.body12}
    ${media.mobile} {
      ${fonts.p2}
    }

    .th {
      ${mixins.flexbox("row", "flex-start", "flex-start")};
      width: 100%;
      padding: 0px 24px;
      align-self: stretch;
      color: ${({ theme }) => theme.color.text04};
      ${media.mobile} {
        padding: 0px 16px;
      }

      .feetier {
        flex: 1 0 0;
        width: 100%;
      }
      .volume,
      .liquidity,
      .apr {
        flex: 1 0 0;
        text-align: right;
      }
    }

    .fee-info {
      ${mixins.flexbox("row", "center", "flex-start")};
      width: 100%;
      padding: 8px 24px;
      gap: 8px;
      align-self: stretch;
      ${media.mobile} {
        padding: 8px 16px;
      }
      &:hover {
        background-color: ${({ theme }) => theme.color.background05Hover};
      }

      .badge-wrap {
        ${mixins.flexbox("column", "flex-start", "flex-start")};
        flex: 1 0 0;
        .badge {
          ${fonts.body11}
          ${media.mobile} {
            ${fonts.p1}
          }
          ${mixins.flexbox("row", "center", "flex-end")};
          padding: 4px 6px;
          gap: 4px;
          color: ${({ theme }) => theme.color.text21};
          background-color: ${({ theme }) => theme.color.background13};
          border: 1px solid ${({ theme }) => theme.color.border02};
          border-radius: 4px;
        }
      }
      .volume,
      .liquidity,
      .apr {
        flex: 1 0 0;
        text-align: right;
        ${fonts.body12}
        ${media.mobile} {
          ${fonts.p2}
        }
      }
    }
  }
`;
