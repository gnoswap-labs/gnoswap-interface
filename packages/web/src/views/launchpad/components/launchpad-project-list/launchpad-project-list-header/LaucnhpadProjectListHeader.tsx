import React from "react";

import { DEVICE_TYPE } from "@styles/media";

import SearchInput from "@components/common/search-input/SearchInput";
import { ProjectListHeaderWrapper } from "./LaunchpadProjectListHeader.styles";
import IconSearch from "@components/common/icons/IconSearch";

interface LaunchpadProjectListHeaderProps {
  keyword: string;
  breakpoint: DEVICE_TYPE;
  isViewSearchIcon: boolean;
  searchRef: React.RefObject<HTMLDivElement>;

  search: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleSearch: () => void;
}

const LaunchpadProjectListHeader: React.FC<LaunchpadProjectListHeaderProps> = ({
  keyword,
  breakpoint,
  search,
  isViewSearchIcon,
  onToggleSearch,
  searchRef,
}) => {
  return (
    <ProjectListHeaderWrapper>
      <div className="title-container">
        <h2>Projects</h2>
        {breakpoint !== DEVICE_TYPE.MOBILE ? (
          <SearchInput width={300} value={keyword} onChange={search} />
        ) : isViewSearchIcon ? (
          <div ref={searchRef as unknown as React.RefObject<HTMLDivElement>}>
            <SearchInput
              width={200}
              height={40}
              value={keyword}
              onChange={search}
            />
          </div>
        ) : (
          <div onClick={onToggleSearch}>
            <IconSearch className="search-icon" />
          </div>
        )}
      </div>
    </ProjectListHeaderWrapper>
  );
};

export default LaunchpadProjectListHeader;
