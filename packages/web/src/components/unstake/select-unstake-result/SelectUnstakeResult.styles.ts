import { fonts } from "@constants/font.constant";
import { css, type Theme } from "@emotion/react";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("column", "center", "center")};
  gap: 4px;
  width: 100%;
  color: ${theme.color.text03};
  ${fonts.body12};
  border-top: 1px solid ${theme.color.border02};
  padding-top: 16px;
  ${media.mobile} {
    padding-top: 12px;
  }
  
  .pooled-section,
  .result-section {
    ${mixins.flexbox("column", "center", "center")};
    width: 100%;
    padding: 15px;
    background-color: ${theme.color.background20};
    border: 1px solid ${theme.color.border02};
    border-radius: 8px;
    gap: 16px;
    ${media.mobile} {
      padding: 11px;
      gap: 8px;
    }
  }

  li {
    width: 100%;
    height: 39px;
    ${mixins.flexbox("column", "flex-end", "center")};
    /* gap: 5px; */
    .main-info {
      width: 100%;
      height: 24px;
      ${mixins.flexbox("row", "center", "center")};

      img {
        width: 24px;
        height: 24px;
      }
      p {
        margin-left: 5px;
      }
      strong {
        margin-left: auto;
      }
    }

    .dollar-value {
      ${fonts.p4}
      color: ${theme.color.text04}
    }
  }

  .result-section {
    ${mixins.flexbox("column", "center", "center")};
    color: ${theme.color.text02};
    ${fonts.body9}
    .result-value {
      margin-left: auto;
    }
    .total-amount-box,
    .apr-box {
      width: 100%;
      ${mixins.flexbox("row", "center", "flex-start")};
    }
    .total-amount-box {
      height: 24px;
      ${media.mobile} {
        height: 18px;
      }
    }
    .apr-box {
      height: 18px;
    }
    h5 {
      margin-right: 4px;
      &.total-amount-title{
        margin-right: 4px;
        color: ${theme.color.text04};
      }
    }
  }

  .hover-info {
    &,
    & * {
      width: 16px;
      height: 16px;
    }
    cursor: default;
    .icon-info {
      * {
        fill: ${theme.color.icon03};
      }
    }
  }
`;
