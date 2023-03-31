import { css, Theme } from "@emotion/react";
import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const TableWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.gray60};
  border-radius: 8px;
  margin: 24px 0px;
  color: ${({ theme }) => theme.colors.gray10};
  ${({ theme }) => theme.fonts.body11};
  overflow-x: auto;
  .token-list-head {
    ${mixins.flexbox("row", "center", "center")}
    ${({ theme }) => theme.fonts.body12};
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray50};
  }

  .token-list-body {
    ${mixins.flexbox("column", "flex-start", "center")};
    width: 100%;
  }
`;

export const TableHeader = styled.div<{ tdWidth: string }>`
  width: ${({ tdWidth }) => tdWidth};
  height: 50px;
  ${mixins.flexbox("row", "center", "flex-end")};
  &.left {
    flex-shrink: 0;
    justify-content: flex-start;
  }
  .index {
    padding-left: 16px;
  }
  .index,
  .name {
    flex-shrink: 0;
    justify-content: flex-start;
  }
  .volumn,
  .most_liquid_pool,
  .last_7_days {
    padding-right: 12px;
  }
  span {
    cursor: pointer;
  }
`;

export const noDataText = (theme: Theme) => css`
  ${mixins.flexbox("row", "center", "center")};
  color: ${theme.colors.gray40};
  ${theme.fonts.body12};
  width: 100%;
  height: 300px;
`;
