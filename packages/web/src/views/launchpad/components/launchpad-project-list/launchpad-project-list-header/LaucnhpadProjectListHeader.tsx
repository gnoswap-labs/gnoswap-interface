import SearchInput from "@components/common/search-input/SearchInput";
import React from "react";

import { ProjectListHeaderWrapper } from "./LaunchpadProjectListHeader.styles";

interface LaunchpadProjectListHeaderProps {
  keyword: string;

  search: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LaunchpadProjectListHeader: React.FC<LaunchpadProjectListHeaderProps> = ({
  keyword,
  search,
}) => {
  return (
    <ProjectListHeaderWrapper>
      <div className="title-container">
        <h2>Projects</h2>
        <SearchInput
          width={300}
          height={48}
          value={keyword}
          onChange={search}
        />
      </div>
    </ProjectListHeaderWrapper>
  );
};

export default LaunchpadProjectListHeader;
