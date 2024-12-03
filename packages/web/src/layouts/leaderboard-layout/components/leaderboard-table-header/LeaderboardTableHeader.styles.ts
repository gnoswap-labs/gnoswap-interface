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
