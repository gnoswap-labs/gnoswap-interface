import { css } from "@emotion/react";

import { BalacneDetailInfo } from "@containers/wallet-balance-container/WalletBalanceContainer";

interface WalletBalanceDetailProps {
  connected: boolean;
  balanceDetailInfo: BalacneDetailInfo | undefined;
}

const WalletBalanceDetail: React.FC<WalletBalanceDetailProps> = () => (
  <div
    css={css`
      border: 1px solid green;
    `}
  >
    <h2>WalletBalanceDetail</h2>
  </div>
);

export default WalletBalanceDetail;
