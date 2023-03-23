import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const AssetListHeaderWrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  width: 100%;
  margin-bottom: 24px;

  .title {
    ${({ theme }) => theme.fonts.h5};
    color: ${({ theme }) => theme.colors.colorWhite};
    margin-right: 35px;
  }

  .filter-wrapper {
    ${mixins.flexbox("row", "center", "flex-start")};
    width: 100%;
  }

  .search-wrapper {
    flex-shrink: 0;
    width: 300px;
    margin-left: 35px;
  }
`;
