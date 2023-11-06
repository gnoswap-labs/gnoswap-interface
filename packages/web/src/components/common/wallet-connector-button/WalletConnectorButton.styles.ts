import { fonts } from "@constants/font.constant";
import styled from "@emotion/styled";
import { media } from "@styles/media";

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

export const FailNetworkTooltipContentWrap = styled.div`
  ${fonts.body12}
  ${media.mobile} {
    ${fonts.p2}
  }
`;
