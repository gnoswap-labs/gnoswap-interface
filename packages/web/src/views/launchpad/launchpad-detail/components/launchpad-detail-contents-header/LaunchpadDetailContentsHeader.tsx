/**
 * @yjin
 * Todo: Delete This code.
 * Change the image tag to a component.
 */
/* eslint-disable @next/next/no-img-element */
import React from "react";

import { ProjectRewardInfoModel } from "../../LaunchpadDetail";

import { ContentsHeaderWrapper } from "./LaunchpadDetailContentsHeader.styles";
import LaunchpadStatusTimeChip from "../common/launchpad-status-time-chip/LaunchpadStatusTimeChip";
import MissingLogo from "@components/common/missing-logo/MissingLogo";

interface LaunchpadDetailContentsHeaderProps {
  data: {
    name: string;
    projectStatus: string | null;
    startTime?: string;
    endTime?: string;
  };
  rewardInfo: ProjectRewardInfoModel;
}

const LaunchpadDetailContentsHeader: React.FC<
  LaunchpadDetailContentsHeaderProps
> = ({ data, rewardInfo }) => {
  return (
    <ContentsHeaderWrapper className="contents-header">
      <div className="symbol-icon">
        <MissingLogo
          symbol={rewardInfo.rewardTokenSymbol}
          url={rewardInfo.rewardTokenLogoUrl}
          width={36}
          mobileWidth={36}
        />
      </div>
      <div className="project-name">{data.name}</div>
      {data.projectStatus && (
        <LaunchpadStatusTimeChip
          startTime={data.startTime}
          endTime={data.endTime}
          status={data.projectStatus}
        />
      )}
    </ContentsHeaderWrapper>
  );
};

export default LaunchpadDetailContentsHeader;
