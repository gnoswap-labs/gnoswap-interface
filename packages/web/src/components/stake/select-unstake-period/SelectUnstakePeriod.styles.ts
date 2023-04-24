import { fonts } from "@constants/font.constant";
import { css, type Theme } from "@emotion/react";
import mixins from "@styles/mixins";
import { sectionBoxStyle } from "@components/stake/stake-liquidity/StakeLiquidity.styles";

export const wrapper = (theme: Theme) => css`
  ${sectionBoxStyle(theme)};
  .select-period {
    ${mixins.flexbox("row", "center", "center")};
    gap: 4px;
    width: 100%;
  }

  .period-box {
    ${sectionBoxStyle(theme)};
    width: calc(100% / 3);
    height: 93px;
    padding: 15px 11px;
    transition: all 0.3s ease;
    cursor: pointer;
    &:hover,
    &.active {
      border-color: ${theme.colors.gray40};
      background-color: ${theme.colors.gray60};
    }

    .days {
      color: ${theme.colors.gray30};
      ${fonts.body12};
    }
    .apr-value {
      color: ${theme.colors.gray10};
      ${fonts.body5}
    }
  }
`;
