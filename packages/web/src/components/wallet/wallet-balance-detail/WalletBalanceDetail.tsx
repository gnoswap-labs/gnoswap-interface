import { BalanceDetailInfo } from "@containers/wallet-balance-container/WalletBalanceContainer";
import { WalletBalanceDetailWrapper } from "./WalletBalanceDetail.styles";
import WalletBalanceDetailInfo from "@components/wallet/wallet-balance-detail-info/WalletBalanceDetailInfo";
import Button, { ButtonHierarchy } from "@components/common/button/Button";

interface WalletBalanceDetailProps {
  balanceDetailInfo: BalanceDetailInfo;
  connected: boolean;
  claimAll: () => void;
}

const WalletBalanceDetail: React.FC<WalletBalanceDetailProps> = ({
  balanceDetailInfo,
  connected,
  claimAll,
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
      button={<ClaimAllButton onClick={claimAll} disabled={connected === false} />}
    />
  </WalletBalanceDetailWrapper>
);

interface ClaimAllButtonProps {
  disabled: boolean;
  onClick: () => void;
}

const ClaimAllButton: React.FC<ClaimAllButtonProps> = ({
  disabled,
  onClick,
}) => (
  <Button
    style={{
      fontType: "p1",
      padding: "10px 16px",
      hierarchy: ButtonHierarchy.Primary
    }}
    text={"Claim All"}
    onClick={onClick}
    disabled={disabled}
  />
);

export default WalletBalanceDetail;
