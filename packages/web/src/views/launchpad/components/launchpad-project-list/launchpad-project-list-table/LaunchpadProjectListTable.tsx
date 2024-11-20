import React from "react";
import { cx } from "@emotion/css";
import { useTranslation } from "react-i18next";

import { noDataText, TableColumn, TableWrapper } from "./LaunchpadProjectListTable.styles";

import { TABLE_HEAD } from "../types";
import { LaunchpadProjectModel } from "@models/launchpad";
import LaunchpadProjectInfo from "./launchpad-project-info/LaunchpadProjectInfo";
import { DEVICE_TYPE } from "@styles/media";
import {
  PROJECT_INFO,
  PROJECT_INFO_SMALL_TABLET,
  PROJECT_INFO_TABLET,
  PROJECT_INFO_MOBILE,
} from "@constants/skeleton.constant";
import TableSkeleton from "@components/common/table-skeleton/TableSkeleton";
import withIntersection from "@components/hoc/with-intersection";

interface LaunchpadProjectListTableProps {
  breakpoint: DEVICE_TYPE;
  projects: LaunchpadProjectModel[];
  isFetched: boolean;

  moveProjectDetail: (poolId: string) => void;
  moveRewardTokenSwapPage: (path: string) => void;
  fetchMore: () => void;
}

const LaunchpadProjectListTable: React.FC<LaunchpadProjectListTableProps> = ({
  breakpoint,
  projects,
  isFetched,
  moveProjectDetail,
  moveRewardTokenSwapPage,
  fetchMore,
}) => {
  const { t } = useTranslation();

  const LastColumn = withIntersection(LaunchpadProjectInfo, fetchMore);

  const isAlignLeft = (head: TABLE_HEAD) => {
    return head === TABLE_HEAD.PROJECT;
  };

  const projectInfo =
    breakpoint === DEVICE_TYPE.MOBILE
      ? PROJECT_INFO_MOBILE
      : breakpoint === DEVICE_TYPE.TABLET_M
      ? PROJECT_INFO_SMALL_TABLET
      : breakpoint === DEVICE_TYPE.TABLET
      ? PROJECT_INFO_TABLET
      : PROJECT_INFO;

  return (
    <TableWrapper>
      <div className="project-list-head">
        {Object.values(TABLE_HEAD).map((head, idx) => {
          return (
            <TableColumn key={idx} className={cx({ left: isAlignLeft(head) })} tdWidth={projectInfo.list[idx].width}>
              <span>{t(head)}</span>
            </TableColumn>
          );
        })}
      </div>
      <div className="project-list-body">
        {isFetched && projects.length === 0 && <div css={noDataText}>{t("Launchpad:projects.noProjectsFound")}</div>}
        {isFetched &&
          projects.length > 0 &&
          projects.map((project, idx) => {
            if (idx < projects.length - 1) {
              return (
                <LaunchpadProjectInfo
                  border={idx !== 0}
                  key={idx}
                  breakpoint={breakpoint}
                  project={project}
                  moveProjectDetail={moveProjectDetail}
                  moveRewardTokenSwapPage={moveRewardTokenSwapPage}
                />
              );
            }
            return (
              <LastColumn
                border
                key={idx}
                breakpoint={breakpoint}
                project={project}
                moveProjectDetail={moveProjectDetail}
                moveRewardTokenSwapPage={moveRewardTokenSwapPage}
              />
            );
          })}
        {!isFetched && (
          <TableSkeleton
            className="skeleton"
            breakpoint={breakpoint}
            info={
              breakpoint === DEVICE_TYPE.WEB
                ? PROJECT_INFO
                : breakpoint !== DEVICE_TYPE.MOBILE
                ? PROJECT_INFO_TABLET
                : PROJECT_INFO_MOBILE
            }
          />
        )}
      </div>
    </TableWrapper>
  );
};

export default LaunchpadProjectListTable;
