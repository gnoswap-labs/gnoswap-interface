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

export const ListBody = styled.div`
  ${mixins.flexbox("column", "flex-start", "center")};
  width: 100%;
`;
