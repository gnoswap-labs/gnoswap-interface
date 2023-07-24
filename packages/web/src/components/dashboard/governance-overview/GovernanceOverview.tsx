import DashboardLabel from "../dashboard-label/DashboardLabel";
import IconOpenLink from "@components/common/icons/IconOpenLink";
import {
  GovernanceOverviewWrapper,
  GovernanceOverviewTitleWrapper,
  GovernanceWrapper,
  IconButton,
} from "./GovernanceOverview.styles";

const GovernanceOverview = ({}) => (
  <GovernanceOverviewWrapper>
    <GovernanceOverviewTitleWrapper>
      <div>Governance Overview</div>
      <IconButton
        onClick={() => {
          alert("open Link");
        }}
      >
        <IconOpenLink className="action-icon" />
      </IconButton>
    </GovernanceOverviewTitleWrapper>
    <GovernanceWrapper>
      <div className="total-issued">
        <div className="label-title">
          <div>Total xGNOS Issued</div>
          <DashboardLabel tooltip="Total amount of xGNOS currently issued through GNOS-GNOT staking." />
        </div>
        <div>59,144,225 xGNOS</div>
      </div>
      <div className="holders">
        <div className="label-title">
          <div>Holders</div>
          <DashboardLabel tooltip="Number of accounts with at least 1 xGNOS." />
        </div>
        <div>14,072</div>
      </div>
      <div className="passed-proposals">
        <div className="label-title">
          <div>Passed Proposals</div>
        </div>
        <div>125</div>
      </div>
      <div className="active-proposals">
        <div className="label-title">
          <div>Active Proposals</div>
        </div>
        <div className="active-proposals-emissions-tooltip">
          <div>2</div>
          <IconButton
            onClick={() => {
              alert("open Link");
            }}
          >
            <IconOpenLink className="action-icon" />
          </IconButton>
        </div>
      </div>
      <div className="community-pool">
        <div className="label-title">
          <div>Community Pool</div>
          <DashboardLabel tooltip="Amount of GNOS accumulated in the Community Pool from emissions." />
        </div>
        <div>2,412,148 GNOS</div>
      </div>
    </GovernanceWrapper>
  </GovernanceOverviewWrapper>
);

export default GovernanceOverview;
