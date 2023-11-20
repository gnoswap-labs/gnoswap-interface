import { fonts } from "@constants/font.constant";
import mixins from "@styles/mixins";
import { inputStyle } from "@components/remove/remove-liquidity/RemoveLiquidity.styles";

import styled from "@emotion/styled";
import { media } from "@styles/media";

export const RemoveLiquiditySelectListItemWrapper = styled.li<{
  selected: boolean;
}>`
  ${({ theme }) => inputStyle(theme)};
  ${mixins.flexbox("row", "center", "flex-start")};
  width: 100%;
  gap: 5px;
  background-color: ${({ theme }) => theme.color.background20};
  border: 1px solid
    ${({ theme, selected }) =>
      selected ? theme.color.border15 : theme.color.border02};
  border-radius: 8px;
  padding: 15px;
  ${fonts.body12};
  color: ${({ theme }) => theme.color.text03};
  transition: all 0.3s ease;

  ${media.mobile} {
    padding: 11px;
  }

  input[type="checkbox"] + label:before {
    background-color: ${({ theme }) => theme.color.background12};
  }

  .liquidity-value {
    margin-left: auto;
    color: ${({ theme }) => theme.color.text02};
  }

  .hover-info {
    &,
    & * {
      width: 16px;
      height: 16px;
    }
    cursor: pointer;
    .icon-info {
      * {
        fill: ${({ theme }) => theme.color.icon03};
      }
    }
  }
  label {
    margin-right: 3px;
  }
  .token-id {
    cursor: default;
  }
`;

export const TooltipWrapperContent = styled.div`
  width: 268px;
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  gap: 8px;
  ${fonts.body12}
  > div {
    &:not(:first-of-type) {
      padding: 4px 0;
    }
    width: 100%;
    ${mixins.flexbox("row", "center", "space-between")};
    .title {
      color: ${({ theme }) => theme.color.text04};
    }
    .value {
      ${mixins.flexbox("row", "center", "center")};
      gap: 8px;
      color: ${({ theme }) => theme.color.text02};
      img {
        width: 20px;
        height: 20px;
      }
    }
  }
  .divider {
    width: 100%;
    border-top: 1px solid ${({ theme }) => theme.color.border01};
    padding: 0 !important;
  }
  .unstake-description {
    color: ${({ theme }) => theme.color.text04};
    ${fonts.p4}
  }
`;