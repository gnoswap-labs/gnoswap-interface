import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const ActiveProjectCardHeader = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  width: 100%;
  .header-title-wrapper {
    ${mixins.flexbox("column", "flex-start", "center")};
    gap: 8px;
    .title {
      color: ${({ theme }) => theme.color.text02};
      font-size: 28px;
      font-weight: 500;
    }
    .text {
      color: ${({ theme }) => theme.color.text05};
      font-size: 14px;
      font-weight: 400;
    }
  }
  .image-wrapper {
    width: 60px;
    height: 60px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`;
