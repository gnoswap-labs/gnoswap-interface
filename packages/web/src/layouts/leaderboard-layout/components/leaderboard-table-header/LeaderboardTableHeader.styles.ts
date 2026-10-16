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
  width: 380px;
  max-width: calc(100vw - 56px);
  color: ${({ theme }) => theme.color.text02};
  font-size: 13px;
  font-weight: 400;
  line-height: 1.65;
  overflow-wrap: anywhere;
  text-align: left;

  p {
    margin: 0;
  }

  p + p {
    margin-top: 12px;
  }

  p:first-of-type:not(:has(.formula)) {
    color: ${({ theme }) => theme.color.text01};
    font-size: 14px;
    font-weight: 500;
    line-height: 1.5;
  }

  strong {
    font-weight: 600;
  }

  .formula {
    display: block;
    padding: 10px 12px;
    border: 1px solid ${({ theme }) => theme.color.border02};
    border-radius: 6px;
    background-color: ${({ theme }) =>
    theme.themeKey === "dark" ? theme.color.background06 : theme.color.background05};
    color: ${({ theme }) => theme.color.text30};
    font-family: inherit;
    font-size: 13px;
    font-style: italic;
    font-weight: 500;
    line-height: 1.6;

    & + br {
      display: none;
    }

    &:not(:last-child) {
      margin-bottom: 10px;
    }
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
