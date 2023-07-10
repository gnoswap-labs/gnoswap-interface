import { fonts } from "@constants/font.constant";
import { css, type Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 300px;
  .inner-wrap {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    width: 100%;
    color: ${theme.color.text02};
    gap: 8px;
    &:not(:first-of-type) {
      border-top: 1px solid ${theme.color.border04};
      padding-top: 8px;
    }
    &:not(:last-of-type) {
      padding-bottom: 8px;
    }
  }
  .content-title {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
  }
  ul {
    ${mixins.flexbox("column", "flex-start", "center")};
    width: 100%;
    gap: 8px;
  }

  li {
    ${mixins.flexbox("row", "center", "flex-start")};
    width: 100%;
    height: 28px;
  }

  .token-logo {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }

  span {
    ${fonts.body12};
    &.amount {
      margin-left: auto;
    }
  }

  h3,
  .total-value {
    color: ${theme.color.text04};
  }

  .claim-content {
    ${fonts.p4};
    color: ${theme.color.text08};
    border-top: 1px solid ${theme.color.border04};
    padding-top: 8px;
    margin-top: 8px;
  }
`;
