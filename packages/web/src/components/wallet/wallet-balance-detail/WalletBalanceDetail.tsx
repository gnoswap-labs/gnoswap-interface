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
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import BigNumber from "bignumber.js";
import LoadingSpinner from "@components/common/loading-spinner/LoadingSpinner";

interface WalletBalanceDetailProps {
  balanceDetailInfo: BalanceDetailInfo;
  connected: boolean;
  isSwitchNetwork: boolean;
  claimAll: () => void;
  breakpoint: DEVICE_TYPE;
  loadngTransactionClaim: boolean;
}

const WalletBalanceDetail: React.FC<WalletBalanceDetailProps> = ({
  balanceDetailInfo,
  connected,
  claimAll,
  breakpoint,
  isSwitchNetwork,
  loadngTransactionClaim,
}) => (
  <WalletBalanceDetailWrapper>
    <WalletBalanceDetailInfo
      loading={balanceDetailInfo.loadingBalance}
      title={"Available Balance"}
      value={balanceDetailInfo.availableBalance}
      tooltip={"Total sum of assets not deposited in liquidity pools."}
    />
    <WalletBalanceDetailInfo
      loading={balanceDetailInfo.loadingPositions}
      title={"Staked Positions"}
      value={balanceDetailInfo.stakedLP}
      tooltip={"Total sum of staked positions."}
    />
    <WalletBalanceDetailInfo
      loading={balanceDetailInfo.loadingPositions}
      title={"Total Claimed Rewards"}
      value={balanceDetailInfo.unstakingLP}
      tooltip={"The cumulative sum of claimed rewards."}
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
            {balanceDetailInfo.loadingPositions ? (
              <div className="value">
                <span css={pulseSkeletonStyle({ h: 20, w: "120px" })} />
              </div>
            ) : (
              <span className="value">
                ${BigNumber(balanceDetailInfo.claimableRewards)
                  .decimalPlaces(2)
                  .toFormat()}
              </span>
            )}
          </div>
        </div>
        <div className="button-wrapper">
          <ClaimAllButton
            onClick={claimAll}
            loadngTransactionClaim={loadngTransactionClaim}
            disabled={
              connected === false ||
              isSwitchNetwork ||
              Number(balanceDetailInfo.claimableRewards) === 0
            }
          />
        </div>
      </InfoWrapper>
    ) : (
      <WalletBalanceDetailInfo
        loading={balanceDetailInfo.loadingPositions}
        title={"Claimable Rewards"}
        value={balanceDetailInfo.claimableRewards}
        tooltip={"Total sum of unclaimed rewards."}
        button={
          <ClaimAllButton
            onClick={claimAll}
            loadngTransactionClaim={loadngTransactionClaim}
            disabled={
              connected === false ||
              isSwitchNetwork ||
              Number(balanceDetailInfo.claimableRewards) === 0
            }
          />
        }
      />
    )}
  </WalletBalanceDetailWrapper>
);

interface ClaimAllButtonProps {
  disabled: boolean;
  onClick: () => void;
  loadngTransactionClaim: boolean;
}

const ClaimAllButton: React.FC<ClaimAllButtonProps> = ({
  disabled,
  onClick,
  loadngTransactionClaim,
}) => (
  <Button
    style={{
      width: 86,
      fontType: "p1",
      padding: "10px 16px",
      hierarchy: ButtonHierarchy.Primary,
    }}
    text={loadngTransactionClaim ? "" : "Claim All"}
    onClick={onClick}
    disabled={disabled}
    leftIcon={
      loadngTransactionClaim ? (
        <LoadingSpinner className="loading-button" />
      ) : undefined
    }
  />
);

export default WalletBalanceDetail;
