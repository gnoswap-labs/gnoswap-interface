import { fonts } from "@constants/font.constant";
import { css, Theme } from "@emotion/react";
import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const TableWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.gray60};
  border-radius: 8px;
  margin: 24px 0px;
  color: ${({ theme }) => theme.colors.gray40};
  ${fonts.body11};
  overflow-x: auto;
  .scroll-wrapper {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    height: auto;
    width: auto;
  }
  .token-list-head {
    width: 100%;
    ${mixins.flexbox("row", "center", "flex-start")};
    height: 50px;
    ${fonts.body12};
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray50};
  }

  .token-list-body {
    ${mixins.flexbox("column", "flex-start", "center")};
    width: 100%;
  }
`;

export const TableHeader = styled.div<{ tdWidth: number }>`
  width: ${({ tdWidth }) => `${tdWidth}px`};
  height: 100%;
  padding: 16px;
  ${mixins.flexbox("row", "center", "flex-end")};
  &.left {
    flex-shrink: 0;
    justify-content: flex-start;
  }

  .index,
  .name {
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
  ${fonts.body12};
  width: 100%;
  height: 300px;
`;
