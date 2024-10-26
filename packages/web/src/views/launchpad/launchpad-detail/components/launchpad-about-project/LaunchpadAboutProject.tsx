import React from "react";

import LaunchpadAboutProjectLinks from "./laucnhpad-about-project-links/LaunchpadAboutProjectLinks";
import { ProjectDescriptionDataModel } from "../../LaunchpadDetail";

import { LaunchpadAboutProjectWrapper } from "./LaunchpadAboutProject.styles";
import LaunchpadShowMoreButton from "../common/launchpad-show-more-button/LaunchpadShowMoreButton";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";

interface LaunchpadAboutProjectProps {
  data: ProjectDescriptionDataModel;
  isShowMore: boolean;
  showLoadMore: boolean;
  isLoading: boolean;

  onClickLoadMore: () => void;
}

const LaunchpadAboutProject: React.FC<LaunchpadAboutProjectProps> = ({
  data,
  isShowMore,
  showLoadMore,
  isLoading,
  onClickLoadMore,
}) => {
  return (
    <LaunchpadAboutProjectWrapper>
      <div className="header">
        {isLoading && <div css={pulseSkeletonStyle({ w: 215, h: 20 })} />}
        {!isLoading && <h2>{`About ${data.name}`}</h2>}
      </div>

      <section className="main-contents">
        <div className="contents">
          {!isLoading && (
            <>
              <div className="description">{data.description}</div>
              {showLoadMore && (
                <LaunchpadShowMoreButton
                  show={isShowMore}
                  onClick={onClickLoadMore}
                />
              )}
            </>
          )}
          {isLoading && (
            <>
              <div css={pulseSkeletonStyle({ w: "100%", h: 20 })} />
              <div css={pulseSkeletonStyle({ w: "100%", h: 20 })} />
            </>
          )}
        </div>

        <LaunchpadAboutProjectLinks
          isLoading={isLoading}
          path={data.realmPath}
          data={data.links}
        />
      </section>
    </LaunchpadAboutProjectWrapper>
  );
};

export default LaunchpadAboutProject;
