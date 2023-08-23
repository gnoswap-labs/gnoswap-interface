import { BalanceDetailInfo } from "@containers/wallet-balance-container/WalletBalanceContainer";
import {
  InfoWrapper,
  WalletBalanceDetailWrapper,
} from "./WalletBalanceDetail.styles";
import WalletBalanceDetailInfo, {
  WalletBalanceDetailInfoTooltip,
} from "@components/wallet/wallet-balance-detail-info/WalletBalanceDetailInfo";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import { DEVICE_TYPE } from "@styles/media";

interface WalletBalanceDetailProps {
  balanceDetailInfo: BalanceDetailInfo;
  connected: boolean;
  claimAll: () => void;
  breakpoint: DEVICE_TYPE;
}

const WalletBalanceDetail: React.FC<WalletBalanceDetailProps> = ({
  balanceDetailInfo,
  connected,
  claimAll,
  breakpoint,
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
    {breakpoint === DEVICE_TYPE.MOBILE ? (
      <InfoWrapper>
        <div className="column-batch">
          <div className="title-wrapper">
            <span className="title">Claimable Rewards</span>
            <WalletBalanceDetailInfoTooltip
              tooltip={"Total sum of unclaimed rewards."}
            />
          </div>
          <div className="value-wrapper">
            <span className="value">{balanceDetailInfo.claimableRewards}</span>
          </div>
        </div>
        <div className="button-wrapper">
          <ClaimAllButton onClick={claimAll} disabled={connected === false} />
        </div>
      </InfoWrapper>
    ) : (
      <WalletBalanceDetailInfo
        title={"Claimable Rewards"}
        value={balanceDetailInfo.claimableRewards}
        tooltip={"Total sum of unclaimed rewards."}
        button={
          <ClaimAllButton onClick={claimAll} disabled={connected === false} />
        }
      />
    )}
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
      width: 86,
      fontType: "p1",
      padding: "10px 16px",
      hierarchy: ButtonHierarchy.Primary,
    }}
    text={"Claim All"}
    onClick={onClick}
    disabled={disabled}
  />
);

export default WalletBalanceDetail;
