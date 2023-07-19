import { fonts } from "@constants/font.constant";
import { css, Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  width: 100%;
  background-color: ${theme.color.background03};
  border: 1px solid ${theme.color.border01};
  border-radius: 10px;
  padding: 15px;
  transition: all 0.3s ease;
  color: ${theme.color.text02};
  cursor: pointer;
  &:hover {
    background-color: ${theme.color.background02};
    box-shadow: 8px 8px 20px rgba(0, 0, 0, 0.08);
  }
  .pool-info {
    ${mixins.flexbox("column", "flex-end", "center")};
    ${fonts.body5}
  }
  .token-pair {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    margin-bottom: 4px;
  }
  .pool-content {
    ${mixins.flexbox("column", "center", "center")};
    ${fonts.body8};
    background-color: ${theme.color.backgroundOpacity};
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
    ${mixins.flexbox("column", "flex-start", "center")};
    gap: 4px;
    &:nth-child(even) {
      align-items: flex-end;
    }
    span {
      ${mixins.flexbox("row", "center", "center")};
    }
  }
  .label-text {
    color: ${theme.color.text04};
    ${fonts.body12};
    height: 18px;
  }
  .value-text {
    height: 41px;
  }
`;
