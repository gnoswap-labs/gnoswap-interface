import { fonts } from "@constants/font.constant";
import { css, Theme } from "@emotion/react";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  grid-gap: 16px;
  grid-template-columns: repeat(4, 1fr);
  .information-wrap {
    ${mixins.flexbox("column", "flex-start", "center")};
    ${fonts.body8};
    color: ${theme.color.green01};
    width: 100%;
    height: 91px;
    background-color: ${theme.color.backgroundOpacity3};
    border: 1px solid ${theme.color.border02};
    border-radius: 8px;
    padding: 15px;
    gap: 16px;
    br {
      display: none;
    }
    .title {
      ${fonts.body12};
      color: ${theme.color.text04};
      @media (max-width: 1180px) {
        ${fonts.p4};
      }
      ${media.mobile} {
        ${fonts.body12};
      }
    }
    .price-info-value {
      ${fonts.body10};
      ${media.mobile} {
        ${fonts.body12};
      }
    }
    .negative {
      color: ${theme.color.red01};
    }
  }
  @media (max-width: 1360px) and (min-width: 930px) {
    .information-wrap {
      padding: 15px 0 15px 15px;
      .title {
        br {
          display: block;
        }
      }
    }
  }
  @media (max-width: 1180px) {
    grid-gap: 8px;
  }
  ${media.mobile} {
    ${mixins.flexbox("column", "flex-start", "center")};
    .information-wrap {
      ${mixins.flexbox("row", "center", "space-between")};
      height: auto;
    }
  }
`;
