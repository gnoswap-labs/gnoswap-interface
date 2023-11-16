import { fonts } from "@constants/font.constant";
import { css, type Theme } from "@emotion/react";
import mixins from "@styles/mixins";

export const wrapper = (theme: Theme) => css`
  ${mixins.flexbox("column", "center", "flex-start")};
  gap: 2px;
  width: 100%;
  height: 100%;
  padding: 16px;
  background-color: ${theme.color.background06};
  border-radius: 8px;
  box-shadow: 8px 8px 20px rgba(0, 0, 0, 0.2);

  .calendar-info {
    ${mixins.flexbox("row", "center", "space-between")};
    width: 100%;
    padding: 8px 10px;
    .title-date {
      ${fonts.body9};
      color: ${theme.color.text03};
    }

    .arrow-button {
      width: 20px;
      height: 20px;
      svg {
        width: 100%;
        height: 100%;
        & * {
          fill: ${theme.color.icon03};
        }
      }
    }
  }

  .date-wrap {
    ${fonts.body12};
    width: 100%;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    span {
      ${mixins.flexbox("row", "center", "center")}
      text-align: center;
      height: 32px;
    }
  }

  .date-head {
    height: 40px;
    padding: 4px 0px;
    span {
      color: ${theme.color.text04};
    }
  }

  .date-body {
    .date {
      cursor: pointer;
      color: ${theme.color.text02};

      &:hover {
        background-color: ${theme.color.background04};
        border-radius: 4px;
      }

      &.selected {
        background-color: ${theme.color.background04};
        border-radius: 4px;
      }
      &.disable-date {
        pointer-events: none;
        cursor: default;
        color: ${theme.color.text22};
        &:hover {
          background-color: transparent;
        }
      }
    }
  }
`;
