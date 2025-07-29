import React from "react";
import { cx } from "@emotion/css";
import { useTranslation } from "react-i18next";

import { noDataText, TableColumn, TableWrapper } from "./LaunchpadProjectListTable.styles";

import { LaunchpadProjectSortOption, SORT_SUPPORT_HEAD, TABLE_HEAD } from "../types";
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
import IconTriangleArrowUp from "@components/common/icons/IconTriangleArrowUp";
import IconTriangleArrowDown from "@components/common/icons/IconTriangleArrowDown";

interface LaunchpadProjectListTableProps {
  breakpoint: DEVICE_TYPE;
  projects: LaunchpadProjectModel[];
  isFetched: boolean;

  moveProjectDetail: (poolId: string) => void;
  moveRewardTokenSwapPage: (path: string) => void;
  fetchMore: () => void;

  sortOption: LaunchpadProjectSortOption | null;
  handleSort: (column: TABLE_HEAD) => void;
}

const LaunchpadProjectListTable: React.FC<LaunchpadProjectListTableProps> = ({
  breakpoint,
  projects,
  isFetched,
  moveProjectDetail,
  moveRewardTokenSwapPage,
  fetchMore,
  sortOption,
  handleSort,
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

  const renderSortIcon = (head: TABLE_HEAD) => {
    if (sortOption?.key === head) {
      if (sortOption.direction === "asc") {
        return <IconTriangleArrowUp className="icon asc" />;
      }
      if (sortOption.direction === "desc") {
        return <IconTriangleArrowDown className="icon desc" />;
      }
    }

    return null;
  };

  return (
    <TableWrapper>
      <div className="project-list-head">
        {Object.values(TABLE_HEAD).map((head, idx) => {
          const canSort = SORT_SUPPORT_HEAD.includes(head);

          return (
            <TableColumn
              key={idx}
              className={cx({ left: isAlignLeft(head), sort: canSort })}
              tdWidth={projectInfo.list[idx].width}
              onClick={() => canSort && handleSort(head)}
            >
              {canSort && renderSortIcon(head)}
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
