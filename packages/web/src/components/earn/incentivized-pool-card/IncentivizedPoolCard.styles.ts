import { css, Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  width: 100%;
  background-color: ${theme.colors.opacityDark05};
  border: 1px solid ${theme.colors.gray60};
  box-shadow: 8px 8px 20px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 16px;
  transition: all 0.3s ease;
  color: ${theme.colors.gray10};
  cursor: pointer;
  &:hover {
    background-color: ${theme.colors.gray50};
    border: 1px solid ${theme.colors.gray40};
  }
  .pool-info {
    ${mixins.flexbox("column", "flex-end", "center")};
    ${theme.fonts.body5}
  }
  .token-pair {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    margin-bottom: 4px;
  }
  .pool-content {
    ${mixins.flexbox("column", "center", "center")};
    ${theme.fonts.body8};
    background-color: ${theme.colors.opacityDark07};
    border-radius: 8px;
    padding: 16px;
    margin-top: 16px;
    gap: 8px;
  }
  .content-section {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
  }
  .content-item {
    ${mixins.flexbox("column", "flex-start", "center")}
    &:nth-child(even) {
      align-items: flex-end;
    }
    span {
      ${mixins.flexbox("row", "center", "center")};
    }
  }
  .label-text {
    color: ${theme.colors.gray40};
    ${theme.fonts.body12};
    height: 18px;
  }
  .value-text {
    height: 41px;
  }
`;
