import { fonts } from "@constants/font.constant";
import { css, Theme } from "@emotion/react";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("column", "center", "center")};
  ${fonts.body8};
  width: 100%;
  height: 214px;
  background-color: ${theme.color.backgroundOpacity3};
  border: 1px solid ${theme.color.border02};
  border-radius: 8px;
  padding: 16px;
  gap: 16px;

  .title-wrap,
  .performance-list {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
  }

  .title {
    ${fonts.body12};
    color: ${theme.color.text04};
    text-align: right;
    width: 200px;
    &.left {
      text-align: left;
    }
  }

  .performance-wrap {
    ${mixins.flexbox("column", "center", "center")};
    width: 100%;
    gap: 16px;
  }
  .performance-list {
    height: 25px;
    span {
      ${fonts.body10};
      width: 200px;
      text-align: right;
      color: ${theme.color.green01};
      &.createdAt {
        color: ${theme.color.text02};
        text-align: left;
      }
      &.negative {
        color: ${theme.color.red01};
      }
      ${media.mobile} {
        ${fonts.body12};
      }
    }
  }
`;
