import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const AssetListHeaderWrapper = styled.div`
  ${mixins.flexbox("row", "center", "flex-start")};
  width: 100%;
  margin-bottom: 24px;

  h2 {
    ${fonts.h5};
    color: ${({ theme }) => theme.color.text02};
    margin-right: 36px;
  }
  .right-section {
    ${mixins.flexbox("row", "center", "center")};
    margin-left: auto;
  }
  .assets-search {
    margin-left: 36px;
  }
`;
