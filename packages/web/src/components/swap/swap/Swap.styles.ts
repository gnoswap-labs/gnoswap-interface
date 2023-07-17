import { css, type Theme } from "@emotion/react";

export const wrapper = (theme: Theme) => css`
  color: ${theme.color.text01};
  height: 100px;
`;
