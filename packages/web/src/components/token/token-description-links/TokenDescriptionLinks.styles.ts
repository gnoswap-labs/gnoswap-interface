import { fonts } from "@constants/font.constant";
import { css, type Theme } from "@emotion/react";
import mixins from "@styles/mixins";
import { media } from "@styles/media";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  h3 {
    color: ${theme.color.text01};
    ${fonts.body11};
    margin-right: 12px;
    ${media.mobile} {
      ${fonts.p3};
    }
  }
  .contract-path {

    ${mixins.flexbox("column", "flex-start", "flex-start")};
    margin-bottom: 24px;
    gap: 12px;
    h4 {
      color: ${theme.color.text01};
      ${fonts.p3};
    }
    button {
      margin-left: 0;
    }
    .icon-wrapper {
      position: relative;
      ${mixins.flexbox("row", "center", "flex-start")};
    }
    ${media.mobile} {
      gap: 8px;
      margin-bottom: 8px;
    }
  }
  .link {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    gap: 12px;
    button {
      margin-left: 0;
    }
    ${media.tablet} {
      ${mixins.flexbox("column", "flex-start", "flex-start")};
    }
    ${media.mobile} {
      ${mixins.flexbox("column", "flex-start", "flex-start")};
      gap: 8px;
    }
  }
  button {
    ${mixins.flexbox("row", "center", "center")};
    ${fonts.p4};
    gap: 4px;
    height: 24px;
    background-color: ${theme.color.background11};
    border-radius: 4px;
    padding: 0px 8px;
    color: ${theme.color.text05};
    margin-left: 4px;
    .link-icon {
      width: 16px;
      height: 16px;
      * {
        fill: ${theme.color.icon03};
      }
    }
  }
  button:hover {
    span {
      color: ${theme.color.text03};
    }
    transition: all 0.3s ease;
    .link-icon {
      * {
        fill: ${theme.color.icon07};
      }
    }
  }
  .group-button {
    ${mixins.flexbox("row", "flex-start", "flex-start")};
    gap: 4px;
  }
  ${media.mobile} {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    gap: 8px;
    .group-button {
      ${mixins.flexbox("row", "center", "flex-start")};
      button {
        &:first-of-type {
          margin-left: 0;
        }
      }
    }
  }
`;

export const copyTooltip = (theme: Theme) => css`
  position: absolute;
  top: -70px;
  left: -35px;
  .box {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    padding: 16px;
    gap: 8px;
    flex-shrink: 0;
    border-radius: 8px;
    ${fonts.body12};
    color: ${theme.color.text02};
    background-color: ${theme.color.background02};
    box-shadow: ${theme.color.shadow03};
  }
  .polygon-icon * {
    fill: ${theme.color.background02};
  }
`;
