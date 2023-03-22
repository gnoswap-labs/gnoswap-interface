import styled from "@emotion/styled";
import mixins from "@/styles/mixins";
import { AssetListTableRowWrapper } from "@components/wallet/asset-list-table/AssetListTable.styles";

export const AssetInfoWrapper = styled(AssetListTableRowWrapper)`
  ${mixins.flexbox("row", "center", "flex-start")};

  & + & {
    border-top: 1px solid ${({ theme }) => theme.colors.gray50};
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray50};
  }

  span {
    ${({ theme }) => theme.fonts.body11};
  }

  .logo {
    width: 20px;
    height: 20px;
    margin-right: 4px;
  }

  .name {
    margin-right: 4px;
  }

  .symbol {
    ${({ theme }) => theme.fonts.body12};
    color: ${({ theme }) => theme.colors.gray40};
  }

  .deposit,
  .withdraw {
    ${mixins.flexbox("row", "center", "center")};
    ${({ theme }) => theme.fonts.body12};
    color: ${({ theme }) => theme.colors.gray40};
    gap: 3px;

    svg {
      width: 16px;
      height: 16px;
    }

    path {
      fill: ${({ theme }) => theme.colors.gray40};
    }
  }
`;
