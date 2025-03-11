import { css } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = () => css`
  ${mixins.flexbox("column", "center", "center")};
  gap: 24px;
`;
