import { fonts } from "@constants/font.constant";
import { css, Theme } from "@emotion/react";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const TableWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  border: 1px solid ${({ theme }) => theme.color.border01};
  border-radius: 8px;
  margin: 24px 0px;
  color: ${({ theme }) => theme.color.text04};
  ${fonts.body11};
  overflow-x: auto;
  .pool-list-head {
    min-width: 100%;
    ${mixins.flexbox("row", "center", "flex-start")}
    height: 50px;
    border-bottom: 1px solid ${({ theme }) => theme.color.border02};
    ${fonts.body12};
  }

  .pool-list-body {
    ${mixins.flexbox("column", "flex-start", "center")};
    width: 100%;
  }
  ${media.mobile} {
    margin-top: 8px;
  }
`;

export const TableColumn = styled.div<{ tdWidth: number }>`
  width: ${({ tdWidth }) => `${tdWidth}px`};
  padding: 16px;
  ${mixins.flexbox("row", "center", "flex-end")};
  &.left {
    flex-shrink: 0;
    justify-content: flex-start;
  }

  span {
    display: inline-flex;
    align-items: center;
    white-space: pre;
  }

  &.left span {
    flex-direction: row-reverse;
  }
  &.sort span {
    cursor: pointer;
  }

  .icon {
    width: 20px;
    height: 20px;
    align-items: center;
    * {
      fill: ${({ theme }) => theme.color.text04};
    }
  }
`;

export const noDataText = (theme: Theme) => css`
  ${mixins.flexbox("row", "center", "center")};
  color: ${theme.color.text04};
  ${fonts.body12};
  width: 100%;
  height: 120px;
`;
