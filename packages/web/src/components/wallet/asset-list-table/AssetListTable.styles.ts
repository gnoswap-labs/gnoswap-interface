import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const AssetListTableWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")}
  width: 100%;
  border: 1px solid ${({ theme }) => theme.color.border01};
  border-radius: 8px;
  color: ${({ theme }) => theme.color.text04};
  ${media.tabletMiddle} {
    margin-bottom: 16px;
  }
  ${fonts.body11};
  overflow-x: auto;
  .asset-list-head {
    min-width: 100%;
    ${mixins.flexbox("row", "center", "flex-start")}
    height: 50px;
    border-bottom: 1px solid ${({ theme }) => theme.color.border02};
    ${fonts.body12};
  }

  .asset-list-body {
    ${mixins.flexbox("column", "flex-start", "center")};
    width: 100%;
  }
`;

export const TableColumn = styled.div<{ tdWidth: number }>`
  width: ${({ tdWidth }) => `${tdWidth}px`};
  height: 100%;
  ${mixins.flexbox("row", "center", "flex-end")};

  .asset {
    padding: 16px;
    ${media.tablet} {
      padding: 16px 0px 16px 16px;
    }
  }
  .chain {
    padding: 16px;
    ${media.tablet} {
      padding: 16px 0px 16px 12px;
    }
  }
  .balance {
    padding: 16px;
    ${media.tablet} {
      padding: 16px 0px;
    }
  }
  .deposit {
    padding: 16px 0 16px 16px;
    ${media.tablet} {
      padding: 16px 0 16px 12px;
    }
  }
  .withdraw {
    padding: 16px 16px 16px 12px;
    ${media.tablet} {
      padding: 16px 16px 16px 12px;
    }
  }
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
