import { css, Theme } from "@emotion/react";
import mixins from "@styles/mixins";
import { sectionBoxStyle } from "@components/incentivize/select-distribution-period/SelectDistributionPeriod.styles";

export const wrapper = (theme: Theme) => css`
  ${sectionBoxStyle(theme)};
  ${mixins.flexbox("row", "flex-start", "center")};
  gap: 24px;
  background-color: ${theme.color.background03};
  padding: 19px 15px;
  .section-title {
    color: ${theme.color.text04};
  }
  .desc {
    height: auto;
    word-break: break-all;
    color: ${theme.color.text05};
  }
`;
