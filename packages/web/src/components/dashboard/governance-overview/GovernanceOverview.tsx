import DashboardLabel from "../dashboard-label/DashboardLabel";
import IconOpenLink from "@components/common/icons/IconOpenLink";
import {
  GovernanceOverviewWrapper,
  GovernanceOverviewTitleWrapper,
  GovernanceWrapper,
  IconButton,
  LabelIconButton,
} from "./GovernanceOverview.styles";
import { GovernenceOverviewInfo } from "@containers/dashboard-info-container/DashboardInfoContainer";

interface GovernanceOverviewProps {
  governenceOverviewInfo: GovernenceOverviewInfo;
}

const GovernanceOverview: React.FC<GovernanceOverviewProps> = ({
  governenceOverviewInfo,
}) => (
  <GovernanceOverviewWrapper>
    <GovernanceOverviewTitleWrapper>
      <div>Governance Overview</div>
      <LabelIconButton
        onClick={() => {
          alert("open Link");
        }}
      >
        <IconOpenLink className="action-icon" />
      </LabelIconButton>
    </GovernanceOverviewTitleWrapper>
    <GovernanceWrapper>
      <div className="total-issued">
        <div className="label-title">
          <div>Total xGNOS Issued</div>
          <DashboardLabel tooltip="Total amount of xGNOS currently issued through GNOS-GNOT staking." />
        </div>
        <div>{governenceOverviewInfo.totalXgnosIssued}</div>
      </div>
      <div className="holders">
        <div className="label-title">
          <div>Holders</div>
          <DashboardLabel tooltip="Number of accounts with at least 1 xGNOS." />
        </div>
        <div>{governenceOverviewInfo.holders}</div>
      </div>
      <div className="passed-proposals">
        <div className="label-title">
          <div>Passed Proposals</div>
        </div>
        <div>{governenceOverviewInfo.passedProposals}</div>
      </div>
      <div className="active-proposals">
        <div className="label-title">
          <div>Active Proposals</div>
        </div>
        <div className="active-proposals-emissions-tooltip">
          <div>{governenceOverviewInfo.activeProposals}</div>
          <IconButton
            onClick={() => {
              alert("open Link");
            }}
          >
            <div className="icon-wrapper">
              <IconOpenLink className="action-icon" />
            </div>
          </IconButton>
        </div>
      </div>
      <div className="community-pool">
        <div className="label-title">
          <div>Community Pool</div>
          <DashboardLabel tooltip="Amount of GNOS accumulated in the Community Pool from emissions." />
        </div>
        <div>{governenceOverviewInfo.communityPool}</div>
      </div>
    </GovernanceWrapper>
  </GovernanceOverviewWrapper>
);

export default GovernanceOverview;
