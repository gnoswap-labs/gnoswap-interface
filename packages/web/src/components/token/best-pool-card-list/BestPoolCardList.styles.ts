import { fonts } from "@constants/font.constant";
import { css, type Theme } from "@emotion/react";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("column", "space-between", "center")};
  ${fonts.body12};
  width: 100%;
  color: ${theme.color.text02};
  gap: 4px;
  .title-wrap {
    ${mixins.flexbox("row", "center", "space-between")};
    color: ${theme.color.text04};
    padding: 0px 24px;
    gap: 4px;
    min-width: max-content;
  }
  .pair {
    min-width: 170px;
    flex: 1.5;
    @media (max-width: 768px) and (min-width: 400px) {
      min-width: 130px;
      max-width: 130px;
    }
  }
  .tvl {
    flex: 1;
    min-width: 90px;
  }
  .apr {
    flex: 1;
    min-width: 60px;
  }
  .tvl,
  .apr {
    text-align: right;
  }

  ul {
    ${mixins.flexbox("column", "space-between", "center")};
    gap: 4px;
    li {
      ${mixins.flexbox("row", "center", "space-between")};
      gap: 4px;
      .pair {
        ${mixins.flexbox("row", "center", "flex-start")};
        flex: 1.5;
        min-width: 170px;
        @media (max-width: 768px) and (min-width: 400px) {
          min-width: 130px;
          max-width: 130px;
        }
      }
      gap: 4px;
      width: 100%;
      height: 36px;
      padding: 0px 24px;
      transition: background-color 0.3s ease;
      cursor: pointer;
      &:hover {
        background-color: ${theme.color.hover04};
      }
      .symbol {
        margin: 0px 8px;
      }
      .fee-rate {
        color: ${theme.color.text04};
      }
      ${media.mobile} {
        gap: 8px;
      }
    }
  }
  @media (max-width: 1180px) {
    .title-wrap {
      padding: 0 16px;
    }
    ul {
      li {
        padding: 0 16px;
      }
    }
  }
`;

export const loadingWrapper = (theme: Theme) => css`
  ${mixins.flexbox("row", "flex-start", "center")}
  width: 100%;
  height: 196px;
  background-color: ${theme.color.background01};
  border-radius: 8px;
  padding-top: 53px;
  > span {
    margin-top: 6px;
    color: ${theme.color.text04};
    ${fonts.body11}
  }
  > div {
    width: 48px;
    height: 48px;
    &::before {
      background-color: ${theme.color.background01};
      width: 38px;
      height: 38px;
    }
  }
`;