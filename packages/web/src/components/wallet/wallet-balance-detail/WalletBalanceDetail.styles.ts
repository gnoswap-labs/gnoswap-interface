import styled from "@emotion/styled";
import mixins from "@styles/mixins";

export const WalletBalanceDetailWrapper = styled.div`
  ${mixins.flexbox("row", "center", "space-between")};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.gray60};
`;
