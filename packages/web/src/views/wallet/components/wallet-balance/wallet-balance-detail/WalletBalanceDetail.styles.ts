import styled from "@emotion/styled";

import { media } from "@styles/media";
import mixins from "@styles/mixins";

export const WalletBalanceDetailWrapper = styled.div`
  ${mixins.flexbox("row", "flex-start", "flex-start")};
  width: 100%;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.background03};
  border: 1px solid ${({ theme }) => theme.color.border02};
  @media (max-width: 968px) {
    flex-direction: column;
  }
  .loading-button {
    width: 20px;
    height: 20px;
    background: conic-gradient(
      from 0deg at 50% 50.63%,
      #ffffff 0deg,
      #233dbd 360deg
    );
    &::before {
      width: 14.8px;
      height: 14.8px;
      background-color: ${({ theme }) => theme.color.background04Hover};
    }
  }
  .claimable-rewards {
    .value {
      max-width: 180px;
      @media (max-width: 968px) {
        max-width: max-content;
      }
    }
  }

  ${media.mobile} {
    flex-direction: column;
  }
`;
