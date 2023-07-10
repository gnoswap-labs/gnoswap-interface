import { fonts } from "@constants/font.constant";
import { css, Theme } from "@emotion/react";
import mixins from "@styles/mixins";
import { sectionBoxStyle } from "@components/incentivize/select-distribution-period/SelectDistributionPeriod.styles";

export const wrapper = (theme: Theme) => css`
  ${sectionBoxStyle(theme)};
  .amount-input-wrap {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    background-color: ${theme.color.backgroundOpacity};
    border: 1px solid ${theme.color.border02};
    border-radius: 8px;
    padding: 15px;
    height: 100%;
    gap: 5px;
  }

  .token-badge {
    ${mixins.flexbox("row", "center", "center")};
    width: 115px;
    height: 32px;
    border: 1px solid green;
  }

  .amount-input {
    border: 1px solid red;
    text-align: right;
    width: 100%;
    height: 100%;
    color: ${theme.color.text01};
    ${fonts.body1};
  }
`;
