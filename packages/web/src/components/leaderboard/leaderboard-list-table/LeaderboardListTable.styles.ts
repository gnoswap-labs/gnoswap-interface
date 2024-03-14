import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const TableWrapper = styled.div`
  color: ${({ theme }) => theme.color.text04};
  ${fonts.body11};

  ${mixins.flexbox("column", "flex-start", "center")};
  width: 100%;
  border: 1px solid ${({ theme }) => theme.color.border01};
  border-radius: 8px;

  overflow-x: auto;
  &.hidden-scroll {
    overflow-x: hidden;
  }
`;

export const ScrollWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};

  height: auto;
  width: auto;
  overflow-y: hidden;

  ${media.mobile} {
    width: 100%;
  }
`;

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

export const ListBody = styled.div`
  ${mixins.flexbox("column", "flex-start", "center")};
  width: 100%;
`;

export const TableHeader = styled.div<{ tdWidth: number }>`
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

  ${media.mobile} {
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
