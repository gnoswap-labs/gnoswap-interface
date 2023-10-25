import styled from "@emotion/styled";

export const WalletConnectorButtonWrapper = styled.div`
  position: relative;
  .arrow-icon {
    width: 16px;
    height: 16px;
  }
  .connected-button {
    background-color: ${({ theme }) => theme.color.background13};
    &:hover {
      background-color: ${({ theme }) => theme.color.backgroundGradient};
    }
  }
  .fail-icon {
    width: 16px;
    height: 16px;
  }
  .switch-network {
    margin: 16px 0;
  }
`;
