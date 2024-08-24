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
  .scroll-wrapper {
    ${mixins.flexbox("column", "flex-start", "flex-start")};
    height: auto;
    width: auto;
  }
  .activity-list-head {
    width: 100%;
    ${mixins.flexbox("row", "center", "flex-start")};
    height: 49px;
    ${fonts.body12};
    border-bottom: 1px solid ${({ theme }) => theme.color.border02};
  }

  .activity-list-body {
    ${mixins.flexbox("column", "flex-start", "center")};
    width: 100%;

  }
  .activity-table {
    height: 66px;
  }
  ${media.mobile} {
    margin-top: 8px;

  }
`;

export const TableHeader = styled.div<{ tdWidth: number }>`
  width: ${({ tdWidth }) => `${tdWidth}px`};
  height: 100%;
  padding: 16px 0px 16px 16px;

  &:last-child {
    padding: 16px;
  }

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

export const MobileTableHeader = styled.div<{ tdWidth: number }>`
  width: ${({ tdWidth }) => `${tdWidth}px`};
  min-width: ${({ tdWidth }) => `${tdWidth}px`};
  height: 100%;
  padding: 16px;
  ${media.mobile} {
    padding: 16px 0px 16px 12px;
  }
  ${mixins.flexbox("row", "center", "flex-end")};
  &.left {
    flex-shrink: 0;
    justify-content: flex-start;
    ${media.mobile} {
      padding: 16px 0px 16px 16px;
    }
  }
  &:nth-last-of-type(1) {
    padding: 0px 16px 0px 0px;
  }

  .index,
  .name {
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
  height: 300px;
`;
