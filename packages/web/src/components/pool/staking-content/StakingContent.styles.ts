import { css } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = () => css`
  ${mixins.flexbox("row", "center", "center")};
  width: 100%;
  gap: 16px;
`;
