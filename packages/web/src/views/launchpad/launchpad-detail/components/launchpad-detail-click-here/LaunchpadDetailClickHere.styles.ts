import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const DetailClickHereWrapper = styled.div`
  ${mixins.flexbox("row", "center", "center")};
  gap: 4px;
  font-size: 14px;
  font-weight: 500;
  .text {
    color: ${({ theme }) => theme.color.text04};
  }
  button {
    ${mixins.flexbox("row", "center", "center")};
    color: ${({ theme }) => theme.color.text08};
    svg {
      width: 16px;
      height: 16px;
    }
  }
`;
