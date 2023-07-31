import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const WalletBalanceDetailWrapper = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.background03};
  border: 1px solid ${({ theme }) => theme.color.border02};
`;
