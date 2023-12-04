import DashboardLabel from "../dashboard-label/DashboardLabel";
import IconOpenLink from "@components/common/icons/IconOpenLink";
import {
  GovernanceOverviewWrapper,
  GovernanceOverviewTitleWrapper,
  GovernanceWrapper,
  IconButton,
  LabelIconButton,
  LoadingTextWrapper,
} from "./GovernanceOverview.styles";
import { GovernenceOverviewInfo } from "@containers/dashboard-info-container/DashboardInfoContainer";
import { SHAPE_TYPES, skeletonTokenDetail } from "@constants/skeleton.constant";

interface GovernanceOverviewProps {
  governenceOverviewInfo: GovernenceOverviewInfo;
  loading: boolean;
}

const LoadingText = () => {
  return (
    <LoadingTextWrapper className="loading-text-wrapper">
      <span
        css={skeletonTokenDetail("150px", SHAPE_TYPES.ROUNDED_SQUARE)}
      />
    </LoadingTextWrapper>
  );
};

const GovernanceOverview: React.FC<GovernanceOverviewProps> = ({
  governenceOverviewInfo,
  loading,
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
          <div>Total xGNS Issued</div>
          <DashboardLabel tooltip="Total amount of xGNOS currently issued through GNS-GNOT staking." />
        </div>
        {!loading ? <div>{governenceOverviewInfo.totalXgnosIssued}</div> : <LoadingText />}
      </div>
      <div className="holders">
        <div className="label-title">
          <div>Holders</div>
          <DashboardLabel tooltip="Number of accounts with at least 1 xGNOS." />
        </div>
        {!loading ? <div>{governenceOverviewInfo.holders}</div> : <LoadingText />}
      </div>
      <div className="passed-proposals">
        <div className="label-title">
          <div>Passed Proposals</div>
        </div>
        {!loading ? <div>{governenceOverviewInfo.passedProposals}</div> : <LoadingText />}

      </div>
      <div className="active-proposals">
        <div className="label-title">
          <div>Active Proposals</div>
        </div>
        <div className="active-proposals-emissions-tooltip">
        {!loading ? <div>{governenceOverviewInfo.activeProposals}</div> : <LoadingText />}

          {!loading && <IconButton
            onClick={() => {
              alert("open Link");
            }}
          >
            <div className="icon-wrapper">
              <IconOpenLink className="action-icon" />
            </div>
          </IconButton>}
        </div>
      </div>
      <div className="community-pool">
        <div className="label-title">
          <div>Community Pool</div>
          <DashboardLabel tooltip="Amount of GNS accumulated in the Community Pool from emissions." />
        </div>
        {!loading ? <div>{governenceOverviewInfo.communityPool}</div> : <LoadingText />}
      </div>
    </GovernanceWrapper>
  </GovernanceOverviewWrapper>
);

export default GovernanceOverview;
