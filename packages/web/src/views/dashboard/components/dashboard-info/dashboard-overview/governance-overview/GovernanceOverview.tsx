import { useTranslation } from "react-i18next";

import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import {
  GovernanceOverviewTitleWrapper,
  GovernanceOverviewWrapper,
  GovernanceWrapper,
  LoadingTextWrapper,
} from "./GovernanceOverview.styles";

import { useMemo } from "react";
import DashboardLabel from "../dashboard-label/DashboardLabel";

export interface GovernanceOverviewInfo {
  totalDelegated: string;
  holders: string;
  passedCount: string;
  activeCount: string;
  communityPool: string;
}

export const nullGovernanceOverviewInfo: GovernanceOverviewInfo = {
  totalDelegated: "-",
  holders: "-",
  passedCount: "-",
  activeCount: "-",
  communityPool: "-",
};

interface GovernanceOverviewProps {
  governanceOverviewInfo: GovernanceOverviewInfo | null;
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
  governanceOverviewInfo,
  loading,
}) => {
  const { t } = useTranslation();

  const overViewInfo = useMemo(() => {
    if (!governanceOverviewInfo) {
      return nullGovernanceOverviewInfo;
    }
    return governanceOverviewInfo;
  }, [governanceOverviewInfo]);

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
            <div className="value">{overViewInfo.totalDelegated}</div>
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
            <div className="value">{overViewInfo.holders}</div>
          ) : (
            <LoadingText />
          )}
        </div>
        <div className="passed-proposals">
          <div className="label-title">
            <div>{t("Dashboard:govOver.passedProp.label")}</div>
          </div>
          {!loading ? (
            <div className="value">{overViewInfo.passedCount}</div>
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
              <div className="value">{overViewInfo.activeCount}</div>
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
            <div className="value">{overViewInfo.communityPool}</div>
          ) : (
            <LoadingText />
          )}
        </div>
      </GovernanceWrapper>
    </GovernanceOverviewWrapper>
  );
};

export default GovernanceOverview;
