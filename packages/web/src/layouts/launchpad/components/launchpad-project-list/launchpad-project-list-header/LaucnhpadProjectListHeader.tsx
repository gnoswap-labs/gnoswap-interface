import React from "react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return (
    <ProjectListHeaderWrapper id="project-list">
      <div className="title-container">
        <h2>{t("Launchpad:projects.col.project")}</h2>
        {breakpoint !== DEVICE_TYPE.MOBILE ? (
          <SearchInput width={300} value={keyword} onChange={search} />
        ) : isViewSearchIcon ? (
          <div ref={searchRef as unknown as React.RefObject<HTMLDivElement>}>
            <SearchInput width={200} height={40} value={keyword} onChange={search} />
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
