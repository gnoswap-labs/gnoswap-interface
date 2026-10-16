import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const ListHead = styled.div`
  width: 100%;
  ${mixins.flexbox("row", "flex-start", "flex-start")};

  height: 50px;
  ${fonts.body12};

  border-bottom: 1px solid ${({ theme }) => theme.color.border02};

  ${media.mobile} {
    ${mixins.flexbox("row", "flex-start", "space-between")};
  }
`;

export const TableHeader = styled.div<{ tdWidth: number }>`
  width: ${({ tdWidth }) => `${tdWidth}px`};
  height: 100%;
  padding: 16px;

  ${mixins.flexbox("row", "center", "flex-start")};
  gap: 4px;

  svg {
    * {
      fill: ${({ theme }) => theme.color.icon03};
    }
  }

  &:first-of-type {
    justify-content: center;
  }

  &:last-child {
    justify-content: flex-end;
    padding-right: 50px;
  }

  ${media.mobile} {
    flex-grow: 2;

    &:first-of-type {
      flex-grow: 0;
    }
    &:last-child {
      justify-content: flex-end;
      padding-right: 16px;
    }
  }
`;

export const TableHeaderTooltipContent = styled.div`
  max-width: 360px;
  font-size: 14px;
  line-height: 1.5;

  p {
    margin: 0;
  }

  p + p {
    margin-top: 8px;
  }

  /* One blank line between the first line and the rest. */
  p:first-of-type {
    margin-bottom: 1.5em;
  }

  strong {
    font-weight: 600;
  }

  .formula {
    display: inline-block;
    padding: 2px 6px;
    border: 1px solid ${({ theme }) => theme.color.border02};
    border-radius: 4px;
    background-color: ${({ theme }) =>
      theme.themeKey === "dark" ? theme.color.background06 : theme.color.background05};
    color: ${({ theme }) => theme.color.text02};
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 13px;
    line-height: 1.5;
  }

  li {
    position: relative;

    &::before {
      content: "•";
      position: absolute;
      left: -16px;
      color: currentColor;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
`;
