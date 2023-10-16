import { fonts } from "@constants/font.constant";
import mixins from "@styles/mixins";
import { inputStyle } from "@components/remove/remove-liquidity/RemoveLiquidity.styles";

import styled from "@emotion/styled";

export const RemoveLiquiditySelectListWrapper = styled.div`
  ${({ theme }) => inputStyle(theme)};
  ${mixins.flexbox("column", "center", "center")};
  width: 100%;
  gap: 4px;

  .checked-all-wrap {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    height: 32px;
    padding: 0px 15px;
    color: ${({ theme }) => theme.color.text05};
    ${fonts.body12};
  }

  ul {
    ${mixins.flexbox("column", "center", "center")};
    gap: 4px;
    width: 100%;
  }

  label {
    line-height: 30px;
    justify-content: center;
    align-items: center;
  }

  label:before {
    display: block;
    content: " ";
    padding-left: 10px;
  }
`;
