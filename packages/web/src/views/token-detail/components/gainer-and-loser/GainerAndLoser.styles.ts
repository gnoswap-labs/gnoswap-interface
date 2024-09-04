import { css, type Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("column", "flex-start", "center")};
  width: 100%;
  background-color: ${theme.color.background01};
  border: 1px solid ${theme.color.border02};
  border-radius: 8px;
`;
