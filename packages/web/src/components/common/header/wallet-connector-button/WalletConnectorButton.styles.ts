import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";

export const WalletConnectorButtonWrapper = styled.div`
  position: relative;
  button {
    min-width: 0;
  }
  .connector-button {
    min-width: 108px;
  }

  .arrow-icon {
    width: 16px;
    height: 16px;
    margin-left: 8px;
  }
  .connected-button {
    background-color: ${({ theme }) => theme.color.background13};
    .render-wallet-icon {
      margin-right: 8px;
      width: 16px;
      height: 16px;
    }
    &:hover {
      background-color: ${({ theme }) => theme.color.backgroundGradient};
    }
  }
  .fail-icon {
    width: 16px;
    height: 16px;
    &.tooltip {
      margin-right: 8px;
    }
  }
  .switch-network {
    margin: 16px 0 0;
  }
  .loading-button {
    width: 20px;
    height: 20px;
    background: conic-gradient(from 0deg at 50% 50.63%, #ffffff 0deg, #233dbd 360deg);
    margin: auto;
    &::before {
      width: 14px;
      height: 14px;
      background-color: ${({ theme }) => theme.color.background04Hover};
    }
  }
`;

export const FailNetworkTooltipContentWrap = styled.div`
  ${fonts.body12}
  ${media.mobile} {
    ${fonts.p2}
  }
`;
