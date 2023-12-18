import { fonts } from "@constants/font.constant";
import { css, Theme } from "@emotion/react";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  height: 100%;
  ${mixins.flexbox("column", "center", "flex-start")}
  main {
    ${mixins.flexbox("row", "center", "center")}
    width: 100%;
    max-width: 1440px;
    flex-grow: 1;
    padding: 190px 40px;
    margin: 0 auto;
    ${media.tablet} {
      padding: 118px 40px;
    }
    ${media.mobile} {
      padding: 48px 0;
      ${mixins.flexbox("column", "center", "center")}
    }
  }
  .icon-404 {
    width: 380px;
    height: 320px;
    ${media.tablet} {
      width: 300px;
      height: 252px;
    }
    ${media.mobile} {
      width: 237.5px;
      height: 200px;
      margin-bottom: 24px;
    }
  }
  .content-section {
    ${mixins.flexbox("column", "flex-start", "flex-start")}
    margin-left: 120px;
    strong {
      font-weight: 700;
      font-size: 40px;
      line-height: 48px;
      color: ${theme.color.text23};
      display: block;
      width: 100%;
    }
    .button-404 {
      height: 50px;
      span {
        ${fonts.body9}
      }
      &:hover {
        background-color: ${theme.color.hover05};
      }
    }
    p {
      font-size: 16px;
      line-height: 22.4px;
      color: ${theme.color.text04};
      margin: 8px 0px 48px;
    }
    ${media.tablet} {
      margin-left: 60px;
      strong {
        ${fonts.body1};
      }
      p {
        ${fonts.body11}
        margin: 4px 0px 24px;
      }
    }

    ${media.mobile} {
      width: 250px;
      margin-left: 0;
      strong {
        text-align: center;
        ${fonts.body5};
      }
      p {
        width: 100%;
        text-align: center;
        ${fonts.body10};
        margin: 8px 0px 16px;
        br {
          display: none;
        }
      }
      .button-404 {
        width: 147px;
        margin: auto;
        height: 44px;
        span {
          ${fonts.body9};
        }
      }
    }
  }

  .btn-arrow-icon {
    margin-right: 8px;
    width: 20px;
    height: 20px;
  }
`;
