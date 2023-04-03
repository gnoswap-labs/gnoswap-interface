import styled from "@emotion/styled";
import mixins from "@styles/mixins";
import { AssetListTableRowWrapper } from "@components/wallet/asset-list-table/AssetListTable.styles";

export const AssetInfoWrapper = styled(AssetListTableRowWrapper)`
  ${mixins.flexbox("row", "center", "flex-start")};
  * {
    ${({ theme }) => theme.fonts.body11};
  }
  & + & {
    border-top: 1px solid ${({ theme }) => theme.colors.gray50};
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray50};
  }

  .logo {
    width: 20px;
    height: 20px;
  }

  .name {
    margin: 0px 4px;
  }

  .symbol {
    ${({ theme }) => theme.fonts.body12};
    color: ${({ theme }) => theme.colors.gray40};
  }
`;

export const LoadButton = styled.button`
  ${mixins.flexbox("row", "center", "center")};
  color: ${({ theme }) => theme.colors.gray40};
  gap: 4px;
  svg {
    width: 16px;
    height: 16px;
    * {
      fill: ${({ theme }) => theme.colors.gray40};
    }
  }
`;
