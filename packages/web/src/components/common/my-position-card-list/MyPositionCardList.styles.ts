import { css, Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  grid-gap: 24px;
  grid-template-columns: repeat(4, 1fr);

  .card-skeleton {
    height: 394px;
    border-radius: 10px;
    box-shadow: 8px 8px 20px 0px rgba(0, 0, 0, 0.2);
  }
`;
