import { BalanceDetailInfo } from "@containers/wallet-balance-container/WalletBalanceContainer";
import { WalletBalanceDetailWrapper } from "./WalletBalanceDetail.styles";
import WalletBalanceDetailInfo from "@components/wallet/wallet-balance-detail-info/WalletBalanceDetailInfo";

interface WalletBalanceDetailProps {
  balanceDetailInfo: BalanceDetailInfo;
}

const WalletBalanceDetail: React.FC<WalletBalanceDetailProps> = ({
  balanceDetailInfo,
}) => (
  <WalletBalanceDetailWrapper>
    <WalletBalanceDetailInfo
      title={"Available Balance"}
      value={balanceDetailInfo.availableBalance}
      tooltip={
        "sum of assets not deposited in liquidity pools and unstaked lp tokens."
      }
    />

    <WalletBalanceDetailInfo
      title={"Staked LP"}
      value={balanceDetailInfo.stakedLP}
    />

    <WalletBalanceDetailInfo
      title={"Unstaking LP"}
      value={balanceDetailInfo.unstakingLP}
      tooltip={"LP Tokens that are currently being unstaked."}
    />

    <WalletBalanceDetailInfo
      title={"Claimable Rewards"}
      value={balanceDetailInfo.claimableRewards}
      tooltip={"Total sum of unclaimed rewards."}
    />
  </WalletBalanceDetailWrapper>
);

export default WalletBalanceDetail;
