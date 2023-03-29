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
  .pool-list-head {
    ${mixins.flexbox("row", "center", "flex-start")}
    height: 50px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray50};
    ${({ theme }) => theme.fonts.body12};
  }

  .pool-list-body {
    ${mixins.flexbox("column", "flex-start", "center")};
    width: 100%;
  }
`;

export const TableColumn = styled.div<{ tdWidth: string }>`
  width: ${({ tdWidth }) => tdWidth};
  padding: 16px;
  ${mixins.flexbox("row", "center", "flex-end")};
  &.left {
    flex-shrink: 0;
    justify-content: flex-start;
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
