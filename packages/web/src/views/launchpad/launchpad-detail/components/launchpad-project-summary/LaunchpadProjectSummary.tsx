import React from "react";
import { useTranslation } from "react-i18next";

import { ProjectSummaryDataModel } from "../../LaunchpadDetail";
import { LAUNCHPAD_DEFAULT_DEPOSIT_TOKEN } from "@common/values/token-constant";
import { toNumberFormat } from "@utils/number-utils";

import { LaunchpadProjectSummaryWrapper } from "./LaunchpadProjectSummary.styles";
import LaunchpadTooltip from "../common/launchpad-tooltip/LaunchpadTooltip";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";

interface LaunchpadProjectSummaryProps {
  data: ProjectSummaryDataModel;
  tokenSymbol: string;
  isLoading: boolean;
}

const LaunchpadProjectSummary: React.FC<LaunchpadProjectSummaryProps> = ({
  data,
  tokenSymbol,
  isLoading,
}) => {
  const { t } = useTranslation();

  return (
    <LaunchpadProjectSummaryWrapper>
      <div className="card border">
        <div className="key">
          {t("Launchpad:projectSummary.col.totalAllocation")}
          <LaunchpadTooltip
            floatingContent={
              <>
                The total amount of project tokens <br />
                allocated for the GnoSwap launchpad.
              </>
            }
          />
        </div>
        {isLoading && <div css={pulseSkeletonStyle({ w: 160, h: 22 })} />}
        {!isLoading && (
          <div className="value">
            {data.totalAllocation
              ? `${toNumberFormat(data.totalAllocation, 2)} ${tokenSymbol}`
              : "-"}
          </div>
        )}
      </div>
      <div className="card border">
        <div className="key">
          {t("Launchpad:projectSummary.col.participants")}{" "}
          <LaunchpadTooltip
            floatingContent={
              <>
                The total number of participants in this <br />
                launchpad project.
              </>
            }
          />
        </div>
        {isLoading && <div css={pulseSkeletonStyle({ w: 160, h: 22 })} />}
        {!isLoading && (
          <div className="value">{data.totalParticipants || "-"}</div>
        )}
      </div>
      <div className="card border">
        <div className="key">
          {t("Launchpad:projectSummary.col.totalDeposited")}
          <LaunchpadTooltip
            floatingContent={
              <>
                The total amount of GNS deposited into <br />
                this launchpad project.
              </>
            }
          />
        </div>
        {isLoading && <div css={pulseSkeletonStyle({ w: 160, h: 22 })} />}
        {!isLoading && (
          <div className="value">
            {data.totalDeposited
              ? `${toNumberFormat(
                  data.totalDeposited,
                  2,
                )} ${LAUNCHPAD_DEFAULT_DEPOSIT_TOKEN}`
              : "-"}
          </div>
        )}
      </div>
      <div className="card">
        <div className="key">
          {t("Launchpad:projectSummary.col.tokensDistributed")}
          <LaunchpadTooltip
            floatingContent={
              <>
                The total amount of project tokens <br />
                distributed to participants.
              </>
            }
          />
        </div>
        {isLoading && <div css={pulseSkeletonStyle({ w: 160, h: 22 })} />}
        {!isLoading && (
          <div className="value">
            {data.totalDistributed
              ? `${toNumberFormat(data.totalDistributed, 2)} ${tokenSymbol}`
              : "-"}
          </div>
        )}
      </div>
    </LaunchpadProjectSummaryWrapper>
  );
};

export default LaunchpadProjectSummary;
