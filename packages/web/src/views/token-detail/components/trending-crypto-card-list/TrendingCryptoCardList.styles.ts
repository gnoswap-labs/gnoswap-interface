import { media } from "@styles/media";
import mixins from "@styles/mixins";
import { css, type Theme } from "@emotion/react";
import { fonts } from "@constants/font.constant";

export const wrapper = css`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  gap: 4px;
  > a {
    width: 100%;
  }
  ${media.mobile} {
    gap: 4px;
  }
`;

export const loadingWrapper = (theme: Theme) => css`
  ${mixins.flexbox("row", "flex-start", "center")}
  width: 100%;
  height: 196px;
  background-color: ${theme.color.background01};
  border-radius: 8px;
  padding-top: 64px;
  > span {
    margin-top: 6px;
    color: ${theme.color.text04};
    ${fonts.body11};
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
