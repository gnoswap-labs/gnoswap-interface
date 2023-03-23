import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const AssetListLoaderWrapper = styled.div`
  ${mixins.flexbox("column", "center", "center")};
  width: 100%;
  padding: 24px;

  svg {
    width: 16px;
    height: 16px;
  }

  path {
    fill: ${({ theme }) => theme.colors.gray40};
  }
`;
