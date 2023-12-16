import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const SwapLiquidityWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  padding: 23px 0px;
  gap: 16px;
  ${media.mobile} {
    padding: 15px 0px;
    gap: 12px;
    align-self: stretch;
  }

  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.border02};
  background: ${({ theme }) => theme.color.background01};
  box-shadow: 8px 8px 20px 0px rgba(0, 0, 0, 0.08);

  .box-header {
    ${mixins.flexbox("row", "center", "flex-start")};
    width: 100%;
    padding: 0px 23px;
    gap: 8px;
    color: ${({ theme }) => theme.color.text02};
    ${fonts.body7};
    ${media.mobile} {
      padding: 0px 15px;
    }

    .coin-pair {
      ${mixins.flexbox("row", "flex-start", "flex-start")};

      .gnos-image-wrapper {
        ${mixins.flexbox("row", "center", "center")};
        width: 24px;
        height: 24px;
        border-radius: 100%;
      }
      .gnot-image-wrapper {
        ${mixins.flexbox("row", "center", "center")};
        width: 24px;
        height: 24px;
        border-radius: 100%;
        margin-left: -6px;
      }
      .coin-logo {
        ${mixins.flexbox("row", "center", "flex-start")};
        width: 24px;
        height: 24px;
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
    > a {
      width: 100%;
    }
    .th {
      ${mixins.flexbox("row", "flex-start", "flex-start")};
      width: 100%;
      padding: 0px 24px;
      align-self: stretch;
      color: ${({ theme }) => theme.color.text04};
      ${media.mobile} {
        padding: 0px 16px;
        .volume {
          min-width: 83px;
        }
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
    .inacitve-liquidity {
      cursor: default;
      pointer-events: none;
    }
    .fee-info {
      ${mixins.flexbox("row", "center", "flex-start")};
      width: 100%;
      padding: 7px 23px;
      gap: 8px;
      align-self: stretch;
      &:hover {
        background-color: ${({ theme }) => theme.color.background05Hover};
      }
      ${media.mobile} {
        padding: 7px 15px;
        gap: 4px;
        .volume {
          min-width: 83px;
        }
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
