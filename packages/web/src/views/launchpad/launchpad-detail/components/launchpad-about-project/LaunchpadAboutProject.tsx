import React from "react";

import LaunchpadAboutProjectLinks from "./laucnhpad-about-project-links/LaunchpadAboutProjectLinks";
import { ProjectDescriptionDataModel } from "../../LaunchpadDetail";

import { LaunchpadAboutProjectWrapper } from "./LaunchpadAboutProject.styles";
import LaunchpadShowMoreButton from "../common/launchpad-show-more-button/LaunchpadShowMoreButton";

interface LaunchpadAboutProjectProps {
  loading: boolean;
  data: ProjectDescriptionDataModel;
  isShowMore: boolean;
  showLoadMore: boolean;

  onClickLoadMore: () => void;
}

const LaunchpadAboutProject: React.FC<LaunchpadAboutProjectProps> = ({
  loading,
  data,
  isShowMore,
  showLoadMore,
  onClickLoadMore,
}) => {
  return (
    <LaunchpadAboutProjectWrapper>
      <div className="header">
        <h2>About Gnoswap Protocol</h2>
      </div>

      <section className="main-contents">
        <div className="contents">
          <div className="description">{data.description}</div>
          {showLoadMore && (
            <LaunchpadShowMoreButton
              show={isShowMore}
              onClick={onClickLoadMore}
            />
          )}
        </div>

        <LaunchpadAboutProjectLinks
          isLoading={loading}
          path={data.realmPath}
          data={data.links}
        />
      </section>
    </LaunchpadAboutProjectWrapper>
  );
};

export default LaunchpadAboutProject;
