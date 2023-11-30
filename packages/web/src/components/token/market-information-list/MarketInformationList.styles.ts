import { fonts } from "@constants/font.constant";
import { css, Theme } from "@emotion/react";
import mixins from "@styles/mixins";
import { media } from "@styles/media";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("row", "center", "center")};
  width: 100%;
  gap: 16px;
  .marketInfo-wrap {
    ${mixins.flexbox("column", "flex-start", "center")};
    ${fonts.body8};
    color: ${theme.color.text02};
    width: 100%;
    height: 91px;
    background-color: ${theme.color.backgroundOpacity3};
    border: 1px solid ${theme.color.border02};
    border-radius: 8px;
    padding: 15px;
    gap: 16px;
    .title {
      ${fonts.body12};
      color: ${theme.color.text04};
    }
    .market-info-value {
      ${fonts.body10};
      ${media.mobile} {
        ${fonts.body12};
      }
    }
  }
  @media (max-width: 1180px) {
    grid-gap: 8px;
  }
  ${media.mobile} {
    ${mixins.flexbox("column", "flex-start", "center")};
    .marketInfo-wrap {
      ${mixins.flexbox("row", "center", "space-between")};
      height: auto;
    }
  }
`;
