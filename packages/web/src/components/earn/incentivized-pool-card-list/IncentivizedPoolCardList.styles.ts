import { css } from "@emotion/react";

export const wrapper = () => css`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  grid-gap: 24px;
  grid-template-columns: repeat(4, 1fr);
  padding-bottom: 100px; ;
`;
