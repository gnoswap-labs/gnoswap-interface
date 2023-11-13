import { css, type Theme } from "@emotion/react";
import { inputStyle } from "@components/unstake/unstake-liquidity/UnstakeLiquidity.styles";
import mixins from "@styles/mixins";
import { fonts } from "@constants/font.constant";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("column", "center", "center")};
  width: 100%;
  gap: 4px;
  .checked-all-wrap {
    ${inputStyle(theme)};
    ${mixins.flexbox("row", "center", "flex-start")}
    width: 100%;
    height: 32px;
    padding: 0px 15px;
    color: ${theme.color.text05};
    ${fonts.body12};
    .liquidity-label {
      width: 80px;
      text-align: right;
      margin-left: auto;
    }
  }
  ul {
    ${mixins.flexbox("column", "center", "center")};
    gap: 4px;
    width: 100%;
  }
`;
