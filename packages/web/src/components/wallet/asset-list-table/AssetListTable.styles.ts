import styled from "@emotion/styled";
import mixins from "@/styles/mixins";

export const AssetListTableWrapper = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.gray50};
  border-radius: 8px;

  .header,
  .body {
    width: 100%;
  }

  .description {
    ${mixins.flexbox("column", "center", "center")};
    width: 100%;
    height: 120px;
    ${({ theme }) => theme.fonts.body12};
    color: ${({ theme }) => theme.colors.gray40};
  }
`;

export const AssetListTableRowWrapper = styled.div`
  ${mixins.flexbox("row", "flex-start", "flex-start")};
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray50};

  &:last-child {
    border-bottom: none;
  }

  .column {
    ${mixins.flexbox("row", "center", "flex-start")};
    width: 100%;
    padding: 16px;

    ${({ theme }) => theme.fonts.body12};
    color: ${({ theme }) => theme.colors.gray10};
  }

  .column.right {
    width: 140px;
    flex-shrink: 0;
    justify-content: flex-end;
  }
`;
