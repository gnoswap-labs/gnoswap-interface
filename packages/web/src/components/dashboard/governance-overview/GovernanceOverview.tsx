import DashboardLabel from "../dashboard-label/DashboardLabel";
import {
  GovernanceOverviewWrapper,
  GovernanceOverviewTitleWrapper,
  GovernanceWrapper,
  LoadingTextWrapper,
} from "./GovernanceOverview.styles";
import { GovernenceOverviewInfo } from "@containers/dashboard-info-container/DashboardInfoContainer";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { useTranslation } from "react-i18next";

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
}) => {
  const { t } = useTranslation();

  return (
    <GovernanceOverviewWrapper>
      <GovernanceOverviewTitleWrapper>
        <div>{t("Dashboard:govOver.title")}</div>
      </GovernanceOverviewTitleWrapper>
      <GovernanceWrapper>
        <div className="total-issued">
          <div className="label-title">
            <div>{t("Dashboard:govOver.totalxGNS.label")}</div>
            <DashboardLabel
              tooltip={t("Dashboard:govOver.totalxGNS.tooltip")}
            />
          </div>
          {!loading ? (
            <div className="value">
              {governenceOverviewInfo.totalXgnosIssued}
            </div>
          ) : (
            <LoadingText />
          )}
        </div>
        <div className="holders">
          <div className="label-title">
            <div>{t("Dashboard:govOver.holders.label")}</div>
            <DashboardLabel tooltip={t("Dashboard:govOver.holders.tooltip")} />
          </div>
          {!loading ? (
            <div className="value">{governenceOverviewInfo.holders}</div>
          ) : (
            <LoadingText />
          )}
        </div>
        <div className="passed-proposals">
          <div className="label-title">
            <div>{t("Dashboard:govOver.passedProp.label")}</div>
          </div>
          {!loading ? (
            <div className="value">
              {governenceOverviewInfo.passedProposals}
            </div>
          ) : (
            <LoadingText />
          )}
        </div>
        <div className="active-proposals">
          <div className="label-title">
            <div>{t("Dashboard:govOver.activeProp.label")}</div>
          </div>
          <div className="active-proposals-emissions-tooltip">
            {!loading ? (
              <div className="value">
                {governenceOverviewInfo.activeProposals}
              </div>
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
            <div>{t("Dashboard:govOver.comPool.label")}</div>
            <DashboardLabel tooltip={t("Dashboard:govOver.comPool.tooltip")} />
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
};

export default GovernanceOverview;
