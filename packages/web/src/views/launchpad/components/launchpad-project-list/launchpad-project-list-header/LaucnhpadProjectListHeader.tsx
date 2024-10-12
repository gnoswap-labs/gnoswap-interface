import SearchInput from "@components/common/search-input/SearchInput";
import React from "react";

import { ProjectListHeaderWrapper } from "./LaunchpadProjectListHeader.styles";

const LaunchpadProjectListHeader: React.FC = () => {
  return (
    <ProjectListHeaderWrapper>
      <div className="title-container">
        <h2>Projects</h2>
        <SearchInput width={300} height={48} />
      </div>
    </ProjectListHeaderWrapper>
  );
};

export default LaunchpadProjectListHeader;
