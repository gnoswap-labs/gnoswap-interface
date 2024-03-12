import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const Wrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  height: 68px;
  width: 100%;
  ${fonts.body11};
  &:not(:first-of-type) {
    border-top: 1px solid ${({ theme }) => theme.color.border02};
  }
`;

export const HoverSection = styled.div`
  ${mixins.flexbox("row", "center", "center", false)};
  background-color: ${({ theme }) => theme.color.background01};
  transition: background-color 0.3s ease;
  cursor: pointer;
  height: 100%;
  overflow: hidden;
  &.disabled-pointer {
    pointer-events: none;
  }
  &:hover {
    background-color: ${({ theme }) => theme.color.hover04};
  }

  & > *:first-child {
    justify-content: flex-start;
  }
`;

export const TableColumn = styled.div<{ tdWidth: number }>`
  min-width: ${({ tdWidth }) => `${tdWidth}px`};
  color: ${({ theme }) => theme.color.text01};

  width: ${({ tdWidth }) => `${tdWidth}px`};
  height: 100%;
  padding: 16px;

  ${mixins.flexbox("row", "center", "flex-start")};

  &:first-child {
    justify-content: center;
  }

  &:last-child {
    justify-content: flex-end;
    padding-right: 50px;
  }

  ${media.tablet} {
    flex-grow: 2;

    &:first-child {
      flex-grow: 0;
    }
    &:last-child {
      justify-content: flex-end;
      padding-right: 16px;
    }
  }
`;
