import DashboardLabel from "../dashboard-label/DashboardLabel";
import {
  GovernanceOverviewWrapper,
  GovernanceOverviewTitleWrapper,
  GovernanceWrapper,
  LoadingTextWrapper,
} from "./GovernanceOverview.styles";
import { GovernenceOverviewInfo } from "@containers/dashboard-info-container/DashboardInfoContainer";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";

interface GovernanceOverviewProps {
  governenceOverviewInfo: GovernenceOverviewInfo;
  loading: boolean;
}

const LoadingText = () => {
  return (
    <LoadingTextWrapper className="loading-text-wrapper">
      <span css={pulseSkeletonStyle({ w: "150px", mobileWidth: "120" })} />
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
    </GovernanceOverviewTitleWrapper>
    <GovernanceWrapper>
      <div className="total-issued">
        <div className="label-title">
          <div>Total xGNS Issued</div>
          <DashboardLabel tooltip="Total amount of xGNS currently issued through GNS-GNOT staking." />
        </div>
        {!loading ? (
          <div className="value">{governenceOverviewInfo.totalXgnosIssued}</div>
        ) : (
          <LoadingText />
        )}
      </div>
      <div className="holders">
        <div className="label-title">
          <div>Holders</div>
          <DashboardLabel tooltip="Number of accounts with at least 1 xGNS." />
        </div>
        {!loading ? (
          <div className="value">{governenceOverviewInfo.holders}</div>
        ) : (
          <LoadingText />
        )}
      </div>
      <div className="passed-proposals">
        <div className="label-title">
          <div>Passed Proposals</div>
        </div>
        {!loading ? (
          <div className="value">{governenceOverviewInfo.passedProposals}</div>
        ) : (
          <LoadingText />
        )}
      </div>
      <div className="active-proposals">
        <div className="label-title">
          <div>Active Proposals</div>
        </div>
        <div className="active-proposals-emissions-tooltip">
          {!loading ? (
            <div className="value">{governenceOverviewInfo.activeProposals}</div>
          ) : (
            <LoadingText />
          )}

          {/* {!loading && <IconButton
            onClick={() => {
              alert("open Link");
            }}
          >
            <div className="icon-wrapper">
              <IconOpenLink className="action-icon" />
            </div>
          </IconButton>} */}
        </div>
      </div>
      <div className="community-pool">
        <div className="label-title">
          <div>Community Pool</div>
          <DashboardLabel tooltip="Amount of GNS accumulated in the Community Pool from emissions." />
        </div>
        {!loading ? (
          <div className="value">{governenceOverviewInfo.communityPool}</div>
        ) : (
          <LoadingText />
        )}
      </div>
    </GovernanceWrapper>
  </GovernanceOverviewWrapper>
);

export default GovernanceOverview;
