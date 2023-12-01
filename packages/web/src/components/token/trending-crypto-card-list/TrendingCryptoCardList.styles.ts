import { media } from "@styles/media";
import mixins from "@styles/mixins";
import { css, type Theme } from "@emotion/react";

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
  > div {
    width: 36px;
    height: 36px;
    &::before {
      background-color: ${theme.color.background01};
      width: 24px;
      height: 24px;
    }
  }
`;
