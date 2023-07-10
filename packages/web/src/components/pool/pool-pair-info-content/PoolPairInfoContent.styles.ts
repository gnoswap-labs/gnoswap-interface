import { fonts } from "@constants/font.constant";
import { css, type Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("row", "center", "center")};
  width: 100%;
  height: 155px;
  background-color: ${theme.color.background06};
  border: 1px solid ${theme.color.border02};
  border-radius: 8px;
  ${fonts.body12};
  color: ${theme.color.text04};
  section {
    ${mixins.flexbox("column", "flex-start", "center")};
    padding: 24px 36px;
    height: 100%;
    flex: 1;
    gap: 16px;
    &:not(:first-of-type) {
      border-left: 1px solid ${theme.color.border02};
    }
  }

  .has-tooltip {
    cursor: pointer;
    transition: color 0.3s ease;
    &:hover {
      color: ${theme.color.text07};
    }
  }

  strong {
    ${fonts.body2};
    color: ${theme.color.text02};
  }

  span {
    &.apr-value {
      color: ${theme.color.text05};
    }
    &.status-type {
      color: ${theme.color.green01};
      &.negative {
        color: ${theme.color.red01};
      }
    }
  }
  .sub-info-wrap {
    ${mixins.flexbox("row", "center", "flexstart")};

    .label-info {
      margin-right: 16px;
    }
  }

  .apr-inner-box:first-of-type {
    margin-right: 49px;
  }
`;
