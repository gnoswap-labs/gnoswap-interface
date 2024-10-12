import React from "react";

import { TableColumn, TableWrapper } from "./LaunchpadProjectListTable.styles";

import { TABLE_HEAD } from "../types";
import { LaunchpadProjectModel } from "@models/launchpad";
import LaunchpadProjectInfo from "./launchpad-project-info/LaunchpadProjectInfo";

interface LaunchpadProjectListTableProps {
  projects: LaunchpadProjectModel[];
}

const LaunchpadProjectListTable: React.FC<LaunchpadProjectListTableProps> = ({
  projects,
}) => {
  return (
    <TableWrapper>
      <div className="project-list-head">
        {Object.values(TABLE_HEAD).map((head, idx) => {
          return (
            <TableColumn key={idx} tdWidth={210}>
              <span>{head}</span>
            </TableColumn>
          );
        })}
      </div>
      <div className="project-list-body">
        {projects.length > 0 &&
          projects.map((project, idx) => (
            <LaunchpadProjectInfo key={idx} project={project} />
          ))}
      </div>
    </TableWrapper>
  );
};

export default LaunchpadProjectListTable;
