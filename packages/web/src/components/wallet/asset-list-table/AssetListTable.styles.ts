import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const AssetListTableWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")}
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.gray60};
  border-radius: 8px;
  margin-bottom: 24px;
  color: ${({ theme }) => theme.colors.gray10};
  ${({ theme }) => theme.fonts.body11};
  overflow-x: auto;
  .asset-list-head {
    min-width: 100%;
    ${mixins.flexbox("row", "center", "flex-start")}
    height: 50px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray50};
    ${({ theme }) => theme.fonts.body12};
  }

  .asset-list-body {
    ${mixins.flexbox("column", "flex-start", "center")};
    width: 100%;
  }
`;

export const TableColumn = styled.div<{ tdWidth: number }>`
  width: ${({ tdWidth }) => `${tdWidth}px`};
  padding: 16px;
  ${mixins.flexbox("row", "center", "flex-end")};
  &.left {
    flex-shrink: 0;
    justify-content: flex-start;
  }
  span {
    cursor: pointer;
  }
`;
