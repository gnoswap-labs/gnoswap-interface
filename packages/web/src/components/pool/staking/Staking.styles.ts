import { css, type Theme } from "@emotion/react";
import mixins from "@styles/mixins";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("column", "center", "center")};
  width: 100%;
  gap: 24px;
`;
