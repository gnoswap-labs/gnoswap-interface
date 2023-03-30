import { css, type Theme } from "@emotion/react";

export const wrapper = (theme: Theme) => css`
  color: ${theme.colors.colorWhite};
  height: 100px;
`;
