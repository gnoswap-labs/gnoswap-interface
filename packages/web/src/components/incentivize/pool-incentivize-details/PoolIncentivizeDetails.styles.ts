import { css, Theme } from "@emotion/react";
import mixins from "@styles/mixins";
import { sectionBoxStyle } from "@components/incentivize/select-distribution-period/SelectDistributionPeriod.styles";
import { fonts } from "@constants/font.constant";

export const wrapper = (theme: Theme) => css`
  ${sectionBoxStyle(theme)};
  width: 100%;

  section {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    ${fonts.body12};
    .section-title {
      color: ${theme.color.text04};
    }
    .token-logo {
      width: 24px;
      height: 24px;
    }
    span {
      color: ${theme.color.text03};
    }
    .section-info {
      ${mixins.flexbox("row", "center", "center")};
      gap: 5px;
    }
  }

  section.period-section {
    ${mixins.flexbox("row", "flex-start", "space-between")};
    padding: 8px 0px 4px;
    .section-info {
      ${mixins.flexbox("column", "flex-end", "center")};
      text-align: right;
    }
    .period-desc {
      color: ${theme.color.text04};
      ${fonts.p4}
    }
  }
`;
