import styled from "@emotion/styled";
import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const WalletBalanceDetailWrapper = styled.div`
  ${mixins.flexbox("row", "flex-start", "flex-start")};
  width: 100%;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.background03};
  border: 1px solid ${({ theme }) => theme.color.border02};
  ${media.mobile} {
    flex-direction: column;
  }
`;
