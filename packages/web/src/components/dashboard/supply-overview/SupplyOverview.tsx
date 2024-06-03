import { SupplyOverviewInfo } from "@containers/dashboard-info-container/DashboardInfoContainer";
import DashboardLabel from "../dashboard-label/DashboardLabel";
import {
  SupplyOverviewWrapper,
  SupplyInfoWrapper,
  ProgressBar,
  LoadingTextWrapper,
  LoadingProgressWrapper,
  BlockEmissionsWrapper,
} from "./SupplyOverview.styles";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";

interface SupplyOverviewInfoProps {
  supplyOverviewInfo: SupplyOverviewInfo;
  loading: boolean;
}

const LoadingText = ({ className }: { className?: string }) => {
  return (
    <LoadingTextWrapper className={`loading-text-wrapper ${className ?? ""}`}>
      <span css={pulseSkeletonStyle({ w: "150px", mobileWidth: "120" })} />
    </LoadingTextWrapper>
  );
};

const LoadingProgress = () => {
  return (
    <LoadingProgressWrapper className="loading-text-wrapper">
      <span css={pulseSkeletonStyle({ w: "100%" })} />
    </LoadingProgressWrapper>
  );
};

const BlockEmissions = () => {
  return (
    <BlockEmissionsWrapper>
      <h5>Block Emissions</h5>
      <div className="content">
        <div className="label">Liquidity Staking </div>
        <div className="value">
          <img src="/gnos.svg" alt="logo" />
          <div>0 / day</div>
        </div>
      </div>
      <div className="content">
        <div className="label">DevOps </div>
        <div className="value">
          <img src="/gnos.svg" alt="logo" />
          <div>0 / day</div>
        </div>
      </div>
      <div className="content">
        <div className="label">Community </div>
        <div className="value">
          <img src="/gnos.svg" alt="logo" />
          <div>0 / day</div>
        </div>
      </div>
    </BlockEmissionsWrapper>
  );
};

const SupplyOverview: React.FC<SupplyOverviewInfoProps> = ({
  supplyOverviewInfo,
  loading,
}) => (
  <SupplyOverviewWrapper>
    <div className="supply-overview">Supply Overview</div>
    <SupplyInfoWrapper>
      <div className="total-supply">
        <div className="label-title">
          Total Supply
          <DashboardLabel tooltip={<>The total supply of GNS tokens is <br />1,000,000,000 GNS.</>} />
        </div>
        {!loading ? (
          <div className="supply-value">{supplyOverviewInfo.totalSupply}</div>
        ) : (
          <LoadingText />
        )}
      </div>
      <div className="circulating-supply">
        <div className="circulating-info">
          <div className="label-title">
            <div>Circulating Supply</div>
            <DashboardLabel tooltip="The sum of liquid GNS tokens including released vesting allocations and cumulative block emissions." />
          </div>
          {!loading ? (
            <div className="supply-value">{supplyOverviewInfo.circulatingSupply}</div>
          ) : (
            <LoadingText />
          )}
        </div>
        {!loading ? (
          <ProgressBar width={supplyOverviewInfo.progressBar}>
            <div className="progress-bar-rate" />
          </ProgressBar>
        ) : (
          <LoadingProgress />
        )}
      </div>
      <div className="daily-block-emissions">
        <div className="label-title">
          <div>Daily Block Emissions</div>
          <DashboardLabel tooltip="Number of newly minted GNS tokens per block." />
        </div>
        <div className="daily-block-emissions-tooltip">
          {!loading ? (
            <div className="supply-value">{supplyOverviewInfo.dailyBlockEmissions}</div>
          ) : (
            <LoadingText />
          )}
          {!loading && <DashboardLabel tooltip={<BlockEmissions />} />}
        </div>
      </div>
      <div className="total-staked">
        <div className="label-title">
          <div>Total Staked</div>
          <DashboardLabel tooltip="Amount of GNS in LPs being staked." />
        </div>
        <div className="staked-info">
          {!loading ? (
            <div className="supply-value">{supplyOverviewInfo.totalStaked}</div>
          ) : (
            <LoadingText className="loading-staked-info" />
          )}
          {!loading ? (
            <div className="staked-ratio-title">
              Staking Ratio: {supplyOverviewInfo.stakingRatio}
            </div>
          ) : (
            <LoadingText className="loading-staked-ratio" />
          )}
        </div>
      </div>
    </SupplyInfoWrapper>
  </SupplyOverviewWrapper>
);

export default SupplyOverview;
