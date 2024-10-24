import styled from "@emotion/styled";

import { fonts } from "@constants/font.constant";
import mixins from "@styles/mixins";
import { media } from "@styles/media";

import { DecreaseLiquidityBoxStyle } from "../../decrease-liquidity/DecreaseLiquidity.styles";

interface Props {
  isDisabled?: boolean;
}

export const BalanceChangeWrapper = styled.div<Props>`
  ${({ theme }) => DecreaseLiquidityBoxStyle(theme)};
  position: relative;
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  .header-wrapper {
    margin-bottom: 14px;
    ${media.mobile} {
      margin-bottom: 6px;
    }
    ${mixins.flexbox("row", "center", "space-between")};
    position: relative;
    .setting-button {
      width: 24px;
      height: 24px;
      .setting-icon * {
        fill: ${({ theme }) => theme.color.icon03};
      }
      .setting-icon:hover * {
        fill: ${({ theme }) => theme.color.icon07};
      }
    }
  }
  h5 {
    color: ${({ theme }) => theme.color.text04};
    ${fonts.body12}
  }

  ${media.mobile} {
    gap: 2px;
  }
  .common-bg {
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.color.border02};
    background: ${({ theme }) => theme.color.background20};
  }
  .select-position {
    margin-top: 14px;
    padding: 11px 15px;
    gap: 16px;
    width: 100%;
    ${mixins.flexbox("column", "center", "space-between")};
    ${media.mobile} {
      margin-top: 10px;
    }
  }
  .table-balance-change {
    width: 100%;
    display: grid;
    grid-template-columns: 0.5fr 1fr 1fr;
    column-gap: 2px;
    .label {
      color: ${({ theme }) => theme.color.text04};
      ${fonts.body12}
    }
    .value {
      ${fonts.body12}
      color: ${({ theme }) => theme.color.text03};
      ${mixins.flexbox("row", "center", "flex-start")};
      gap: 4px;
    }
    p {
      &:nth-of-type(1) {
        width: 89px;
      }
      &:nth-of-type(2) {
        text-align: right;
        ${media.mobile} {
          display: none;
        }
      }
      &:nth-of-type(3) {
        text-align: right;
      }
      &.new-balance {
        color: ${({ theme }) => theme.color.text03};
      }
    }
  }
`;

export const ToolTipContentWrapper = styled.div`
  width: 250px;
  ${fonts.body12}
  color: ${({ theme }) => theme.color.text02};
`;
