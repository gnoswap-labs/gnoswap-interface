import { css } from "@emotion/react";

import { BalanceSummaryInfo } from "@containers/wallet-balance-container/WalletBalanceContainer";

interface WalletBalanceSummaryProps {
  connected: boolean;
  balanceSummaryInfo: BalanceSummaryInfo | undefined;
  deposit: () => void;
  withdraw: () => void;
  earn: () => void;
};

const WalletBalanceSummary: React.FC<WalletBalanceSummaryProps> = ({
  connected,
  balanceSummaryInfo,
  deposit,
  withdraw,
  earn
}) => (
  <div
    css={css`
      border: 1px solid green;
    `}
  >
    <h2>WalletBalanceSummary</h2>
  </div>
);

export default WalletBalanceSummary;
