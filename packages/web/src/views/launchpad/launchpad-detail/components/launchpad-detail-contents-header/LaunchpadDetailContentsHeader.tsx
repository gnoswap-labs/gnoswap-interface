/**
 * @yjin
 * Todo: Delete This code.
 * Change the image tag to a component.
 */
/* eslint-disable @next/next/no-img-element */
import React from "react";
import { cx } from "@emotion/css";

import { capitalize } from "@utils/string-utils";
import { ProjectRewardInfoModel } from "../../LaunchpadDetail";

import IconTimer from "@components/common/icons/IconTimer";
import { ContentsHeaderWrapper } from "./LaunchpadDetailContentsHeader.styles";

interface LaunchpadDetailContentsHeaderProps {
  data: { name: string; projectStatus: string | null };
  rewardInfo: ProjectRewardInfoModel;
}

const LaunchpadDetailContentsHeader: React.FC<
  LaunchpadDetailContentsHeaderProps
> = ({ data, rewardInfo }) => {
  return (
    <ContentsHeaderWrapper className="contents-header">
      <div className="symbol-icon">
        <img
          src={rewardInfo.rewardTokenLogoUrl}
          alt={`${rewardInfo.rewardTokenSymbol} symbol image`}
        />
      </div>
      <div className="project-name">{data.name}</div>
      <div
        className={cx("project-status", {
          [(data.projectStatus as string)?.toLowerCase()]: !!data.projectStatus,
        })}
      >
        {data.projectStatus && (
          <>
            <IconTimer type={data.projectStatus} />{" "}
            {capitalize(data.projectStatus)}
          </>
        )}
      </div>
    </ContentsHeaderWrapper>
  );
};

export default LaunchpadDetailContentsHeader;
