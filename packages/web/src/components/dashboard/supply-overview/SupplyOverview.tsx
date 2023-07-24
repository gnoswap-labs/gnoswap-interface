import DashboardLabel from "../dashboard-label/DashboardLabel";
import {
  SupplyOverviewWrapper,
  SupplyInfoWrapper,
  TotalStakedRatioWrapper,
  ProgressBar,
} from "./SupplyOverview.styles";

const SupplyOverview = ({}) => (
  <SupplyOverviewWrapper>
    <div className="supply-overview">Supply Overview</div>
    <SupplyInfoWrapper>
      <div className="total-supply">
        <div className="label-title">
          <div>Total Supply</div>
          <DashboardLabel tooltip="The total supply of GNOS tokens is 1,000,000,000 GNOS." />
        </div>
        <div>1,000,000,000 GNOS</div>
      </div>
      <div className="circulating-supply">
        <div className="label-title">
          <div>Circulating Supply</div>
          <DashboardLabel tooltip="The sum of liquid GNOS tokens including released vesting allocations and cumulative block emissions." />
        </div>
        <div>218,184,885 GNOS</div>
      </div>
      <ProgressBar>
        <div className="progress-bar-rate" />
      </ProgressBar>
      <div className="daily-block-emissions">
        <div className="label-title">
          <div>Daily Block Emissions</div>
          <DashboardLabel tooltip="Number of newly minted GNOS tokens per block." />
        </div>
        <div className="daily-block-emissions-tooltip">
          <div>580 GNOS</div>
          <DashboardLabel tooltip="TBD" />
        </div>
      </div>
      <div className="total-staked">
        <div className="label-title">
          <div>Total Staked</div>
          <DashboardLabel tooltip="Amount of GNOS in LPs being staked." />
        </div>
        <TotalStakedRatioWrapper>
          <div>152,412,148 GNOS</div>
          <div className="staked-ratio-title">Staking Ratio: 55.15%</div>
        </TotalStakedRatioWrapper>
      </div>
    </SupplyInfoWrapper>
  </SupplyOverviewWrapper>
);

export default SupplyOverview;
