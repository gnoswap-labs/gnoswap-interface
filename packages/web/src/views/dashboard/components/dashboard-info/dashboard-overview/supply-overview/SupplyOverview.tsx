import { Trans, useTranslation } from "react-i18next";

import { pulseSkeletonStyle } from "@constants/skeleton.constant";

import DashboardLabel from "../dashboard-label/DashboardLabel";

import {
  BlockEmissionsWrapper, LoadingProgressWrapper, LoadingTextWrapper, ProgressBar, SupplyInfoWrapper, SupplyOverviewWrapper
} from "./SupplyOverview.styles";

export interface DailyBlockEmissionsInfo {
  liquidityStaking: string;
  devOps: string;
  community: string;
}

export interface SupplyOverviewInfo {
  totalSupply: string;
  circulatingSupply: string;
  progressBar: string;
  dailyBlockEmissions: string;
  dailyBlockEmissionsInfo: DailyBlockEmissionsInfo;
  totalStaked: string;
  stakingRatio: string;
}

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

export interface BlockEmissionsProps {
  liquidityStaking: string;
  devOps: string;
  community: string;
}

const BlockEmissions = ({
  liquidityStaking,
  devOps,
  community,
}: BlockEmissionsProps) => {
  const { t } = useTranslation();
  return (
    <BlockEmissionsWrapper>
      <h5>{t("Dashboard:supOver.dailyBlock.label")}</h5>
      <div className="content">
        <div className="label">
          {t("Dashboard:supOver.blocEmiss.tooltip.liquiStaking")}{" "}
        </div>
        <div className="value">
          <img src="/gns.svg" alt="logo" />
          <div>
            {liquidityStaking} / {t("common:day.base")}
          </div>
        </div>
      </div>
      <div className="content">
        <div className="label">
          {t("Dashboard:supOver.blocEmiss.tooltip.devOps")}{" "}
        </div>
        <div className="value">
          <img src="/gns.svg" alt="logo" />
          <div>
            {devOps} / {t("common:day.base")}
          </div>
        </div>
      </div>
      <div className="content">
        <div className="label">
          {t("Dashboard:supOver.blocEmiss.tooltip.community")}{" "}
        </div>
        <div className="value">
          <img src="/gns.svg" alt="logo" />
          <div>
            {community} / {t("common:day.base")}
          </div>
        </div>
      </div>
    </BlockEmissionsWrapper>
  );
};

const SupplyOverview: React.FC<SupplyOverviewInfoProps> = ({
  supplyOverviewInfo,
  loading,
}) => {
  const { t } = useTranslation();

  return (
    <SupplyOverviewWrapper>
      <div className="supply-overview">{t("Dashboard:supOver.title")}</div>
      <SupplyInfoWrapper>
        <div className="total-supply">
          <div className="label-title">
            {t("Dashboard:supOver.totalSup.label")}
            <DashboardLabel
              tooltip={
                <Trans
                  ns="Dashboard"
                  i18nKey={"supOver.totalSup.tooltip"}
                  values={{ amount: supplyOverviewInfo.totalSupply }}
                  components={{ br: <br /> }}
                />
              }
            />
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
              <div>{t("Dashboard:supOver.circulSup.label")}</div>
              <DashboardLabel
                tooltip={t("Dashboard:supOver.circulSup.tooltip")}
              />
            </div>
            {!loading ? (
              <div className="supply-value">
                {supplyOverviewInfo.circulatingSupply}
              </div>
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
            <div>{t("Dashboard:supOver.dailyBlock.label")}</div>
            <DashboardLabel
              tooltip={t("Dashboard:supOver.dailyBlock.tooltip")}
            />
          </div>
          <div className="daily-block-emissions-tooltip">
            {!loading ? (
              <div className="supply-value">
                {supplyOverviewInfo.dailyBlockEmissions}
              </div>
            ) : (
              <LoadingText />
            )}
            {!loading && (
              <DashboardLabel
                tooltip={
                  <BlockEmissions
                    {...supplyOverviewInfo.dailyBlockEmissionsInfo}
                  />
                }
              />
            )}
          </div>
        </div>

        <div className="total-staked">
          <div className="label-title">
            <div>{t("Dashboard:supOver.totalStaked.label")}</div>
            <DashboardLabel
              tooltip={t("Dashboard:supOver.totalStaked.tooltip")}
            />
          </div>
          <div className="staked-info">
            {!loading ? (
              <div className="supply-value">
                {supplyOverviewInfo.totalStaked}
              </div>
            ) : (
              <LoadingText className="loading-staked-info" />
            )}
            {!loading ? (
              <div className="staked-ratio-title">
                {t("Dashboard:supOver.totalStaked.stakeRatio")}:{" "}
                {supplyOverviewInfo.stakingRatio}
              </div>
            ) : (
              <LoadingText className="loading-staked-ratio" />
            )}
          </div>
        </div>
      </SupplyInfoWrapper>
    </SupplyOverviewWrapper>
  );
};

export default SupplyOverview;
