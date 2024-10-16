import React from "react";

// import IconArrowDown from "@components/common/icons/IconArrowDown";
import LaunchpadAboutProjectLinks from "./laucnhpad-about-project-links/LaunchpadAboutProjectLinks";

import { LaunchpadAboutProjectWrapper } from "./LaunchpadAboutProject.styles";

interface LaunchpadAboutProjectProps {
  loading: boolean;
}

const LaunchpadAboutProject: React.FC<LaunchpadAboutProjectProps> = ({
  loading,
}) => {
  return (
    <LaunchpadAboutProjectWrapper>
      <div className="header">
        <h2>About Gnoswap Protocol</h2>
      </div>

      <section className="main-contents">
        <div className="contents">
          <div className="description"></div>
          {/* <div className="show-more">
            show more <IconArrowDown fill="#596782" />
          </div> */}
        </div>

        <LaunchpadAboutProjectLinks isLoading={loading} />
      </section>
    </LaunchpadAboutProjectWrapper>
  );
};

export default LaunchpadAboutProject;
