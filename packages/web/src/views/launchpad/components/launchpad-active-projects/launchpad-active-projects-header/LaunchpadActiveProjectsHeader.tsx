import React from "react";
import { useTranslation } from "react-i18next";

import { ActiveProjectsHeaderTextWrapper, ActiveProjectsWrapper } from "./LaunchpadActiveProjectsHeader.styles";

export interface LaunchpadActiveProjectsHeaderProps {
  count: number;
}

const LaunchpadActiveProjectsHeader: React.FC<LaunchpadActiveProjectsHeaderProps> = ({ count }) => {
  const { t } = useTranslation();

  const countStr = React.useMemo(() => {
    if (count === null) {
      return "-";
    }

    return count.toLocaleString();
  }, [count]);

  return (
    <ActiveProjectsWrapper>
      <div className="header-content">
        <ActiveProjectsHeaderTextWrapper>
          <div className="launchpad-active-projects-title-wrapper">
            <span>{t("Launchpad:main.activeProject.title")}</span>
            <span className="value">{countStr}</span>
          </div>
        </ActiveProjectsHeaderTextWrapper>
      </div>
    </ActiveProjectsWrapper>
  );
};

export default LaunchpadActiveProjectsHeader;
