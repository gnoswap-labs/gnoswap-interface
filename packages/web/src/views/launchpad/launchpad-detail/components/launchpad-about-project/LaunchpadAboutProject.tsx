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
          <div className="description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            nisi orci, ultrices sit amet mi eget, efficitur elementum tellus.
            Integer augue purus, rutrum eu pretium sit amet, varius in quam. In
            auctor gravida pretium. Maecenas est ante, pulvinar id accumsan
            eget, aliquam ac turpis. Donec vulputate nunc tellus. In sit amet
            mattis nisl. Mauris libero quam, hendrerit dapibus scelerisque eu,
            fringilla sit amet sapien. Proin ut semper risus. Vivamus fringilla
            eget lectus ut faucibus. Proin vitae mollis massa. Sed bibendum
            tortor eget aliquam commodo. Etiam et eleifend augue. Donec molestie
            placerat elit. <br />
            <br />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            nisi orci, ultrices sit amet mi eget, efficitur elementum tellus.
            Integer augue purus, rutrum eu pretium sit amet, varius in quam. In
            auctor gravida pretium. Maecenas est ante, pulvinar id accumsan
            eget, aliquam ac turpis. Donec vulputate nunc tellus. In sit amet
            mattis nisl. Mauris libero quam, hendrerit dapibus scelerisque eu...
          </div>
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
