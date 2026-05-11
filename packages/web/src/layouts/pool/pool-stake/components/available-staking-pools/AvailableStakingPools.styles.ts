import { fonts } from "@constants/font.constant";
import { css, type Theme } from "@emotion/react";
import mixins from "@styles/mixins";
import { media } from "@styles/media";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("column", "stretch", "stretch")};
  width: 100%;
  gap: 12px;

  ${media.tabletMiddle} {
    padding-top: 16px;
    border-top: 1px solid ${theme.color.border02};
  }
  ${media.mobile} {
    padding-top: 12px;
  }

  .section-title {
    ${fonts.body9}
    color: ${theme.color.text02};
  }

  .pools-card {
    ${mixins.flexbox("column", "stretch", "stretch")};
    width: 100%;
    background-color: ${theme.color.background20};
    border: 1px solid ${theme.color.border02};
    border-radius: 8px;
    padding: 12px 15px;
    gap: 8px;

    ${media.mobile} {
      padding: 11px;
    }
  }

  .pools-table {
    ${mixins.flexbox("column", "stretch", "stretch")};
    width: 100%;
  }

  .pools-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto auto;
    align-items: center;
    column-gap: 16px;
    height: 36px;
    color: ${theme.color.text02};
    ${fonts.body12};
  }

  .pools-row.header {
    color: ${theme.color.text04};
    ${fonts.p4};
    height: 24px;

    .sortable {
      ${mixins.flexbox("row", "center", "flex-start")};
      gap: 4px;

      &.align-right {
        justify-content: flex-end;
      }

      &.clickable {
        cursor: pointer;
        user-select: none;
        &:hover {
          color: ${theme.color.text02};
        }
      }

      &.active {
        color: ${theme.color.text02};
      }

      .sort-icon {
        ${mixins.flexbox("row", "center", "center")};
      }
    }

    .align-right {
      text-align: right;
      justify-self: end;
    }
  }

  .pool-name {
    ${mixins.flexbox("row", "center", "flex-start")};
    gap: 8px;
    min-width: 0;

    .pair {
      ${fonts.body12};
      color: ${theme.color.text02};
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .fee {
      ${fonts.body12};
      color: ${theme.color.text04};
    }
  }

  .incentive-cell {
    ${mixins.flexbox("row", "center", "flex-end")};
    min-width: 56px;
  }

  .apr-cell {
    ${mixins.flexbox("row", "center", "flex-end")};
    gap: 4px;
    min-width: 80px;
    color: ${theme.color.text02};
    ${fonts.body12};
  }

  .empty,
  .loading {
    ${mixins.flexbox("row", "center", "center")};
    width: 100%;
    height: 60px;
    color: ${theme.color.text04};
    ${fonts.body12};
  }
`;
