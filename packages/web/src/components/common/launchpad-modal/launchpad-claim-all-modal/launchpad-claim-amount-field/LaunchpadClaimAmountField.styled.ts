import mixins from "@styles/mixins";
import styled from "@emotion/styled";

export const ClaimAllFieldWrapper = styled.div`
  ${mixins.flexbox("column", "flex-end", "center")}
  gap: 3px;
  .value-token {
    ${mixins.flexbox("row", "center", "center")}
    gap: 4px;
    color: ${({ theme }) => theme.color.text03};
    font-size: 14px;
    font-weight: 400;
    img {
      width: 24px;
      height: 24px;
    }
  }
  .value-price {
    color: ${({ theme }) => theme.color.text04};
    font-size: 12px;
    font-weight: 400;
  }
`;
