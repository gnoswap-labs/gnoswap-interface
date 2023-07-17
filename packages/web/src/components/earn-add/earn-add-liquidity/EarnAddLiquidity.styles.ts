import { css, Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  gap: 24px;
  color: ${theme.color.text02};
  width: 500px;
  height: 100%;
  background-color: ${theme.color.background06};
  border-radius: 8px;
  border: 1px solid ${theme.color.border02};
  box-shadow: 10px 14px 60px rgba(0, 0, 0, 0.4);
  padding: 23px;
  .select-content {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    gap: 4px;
  }
`;
