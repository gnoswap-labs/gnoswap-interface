import { fonts } from "@constants/font.constant";
import { css, Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (active: boolean) => (theme: Theme) =>
  css`
    ${mixins.flexbox(
      active ? "column" : "row",
      active ? "flex-start" : "center",
      active ? "center" : "space-between",
    )};
    width: 100%;
    background-color: ${theme.colors.opacityDark07};
    border-radius: 8px;
    border: 1px solid ${theme.colors.gray50};
    padding: 15px;
    h5 {
      ${fonts.body12};
      color: ${theme.colors.gray30};
    }
    .select-pair {
      width: 100%;
      gap: 16px;
      margin-top: 16px;
      ${mixins.flexbox("row", "center", "space-between", false)}
    }
  `;
