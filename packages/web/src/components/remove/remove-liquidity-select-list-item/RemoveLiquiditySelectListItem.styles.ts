import { fonts } from "@constants/font.constant";
import mixins from "@styles/mixins";
import { inputStyle } from "@components/remove/remove-liquidity/RemoveLiquidity.styles";

import styled from "@emotion/styled";

export const RemoveLiquiditySelectListItemWrapper = styled.li<{
  selected: boolean;
}>`
  ${({ theme }) => inputStyle(theme)};
  ${mixins.flexbox("row", "center", "flex-start")};
  width: 100%;
  height: 56px;
  gap: 8px;
  background-color: ${({ theme }) => theme.color.background20};
  border: 1px solid
    ${({ theme, selected }) =>
      selected ? theme.color.border03 : theme.color.border02};
  border-radius: 8px;
  padding: 15px;
  ${fonts.body12};
  color: ${({ theme }) => theme.color.text03};
  transition: all 0.3s ease;

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
`;
