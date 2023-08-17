import { SupplyOverviewInfo } from "@containers/dashboard-info-container/DashboardInfoContainer";
import DashboardLabel from "../dashboard-label/DashboardLabel";
import {
  SupplyOverviewWrapper,
  SupplyInfoWrapper,
  ProgressBar,
} from "./SupplyOverview.styles";
interface SupplyOverviewInfoProps {
  supplyOverviewInfo: SupplyOverviewInfo;
}

const SupplyOverview: React.FC<SupplyOverviewInfoProps> = ({
  supplyOverviewInfo,
}) => (
  <SupplyOverviewWrapper>
    <div className="supply-overview">Supply Overview</div>
    <SupplyInfoWrapper>
      <div className="total-supply">
        <div className="label-title">
          Total Supply
          <DashboardLabel tooltip="The total supply of GNOS tokens is 1,000,000,000 GNOS." />
        </div>
        <div>{supplyOverviewInfo.totalSupply}</div>
      </div>
      <div className="circulating-supply">
        <div className="circulating-info">
          <div className="label-title">
            <div>Circulating Supply</div>
            <DashboardLabel tooltip="The sum of liquid GNOS tokens including released vesting allocations and cumulative block emissions." />
          </div>
          <div>{supplyOverviewInfo.circulatingSupply}</div>
        </div>
        <ProgressBar>
          <div className="progress-bar-rate" />
        </ProgressBar>
      </div>
      <div className="daily-block-emissions">
        <div className="label-title">
          <div>Daily Block Emissions</div>
          <DashboardLabel tooltip="Number of newly minted GNOS tokens per block." />
        </div>
        <div className="daily-block-emissions-tooltip">
          <div>{supplyOverviewInfo.dailyBlockEmissions}</div>
          <DashboardLabel tooltip="TBD" />
        </div>
      </div>
      <div className="total-staked">
        <div className="label-title">
          <div>Total Staked</div>
          <DashboardLabel tooltip="Amount of GNOS in LPs being staked." />
        </div>
        <div className="staked-info">
          <div>{supplyOverviewInfo.totalStaked}</div>
          <div className="staked-ratio-title">
            Staking Ratio: {supplyOverviewInfo.stakingRatio}
          </div>
        </div>
      </div>
    </SupplyInfoWrapper>
  </SupplyOverviewWrapper>
);

export default SupplyOverview;
