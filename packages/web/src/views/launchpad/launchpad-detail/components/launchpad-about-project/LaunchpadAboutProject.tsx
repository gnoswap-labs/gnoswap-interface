import IconArrowDown from "@components/common/icons/IconArrowDown";
import IconOpenLink from "@components/common/icons/IconOpenLink";
import React from "react";

import {
  LaunchpadAboutProjectWrapper,
  LinkCard,
} from "./LaunchpadAboutProject.styles";

const LaunchpadAboutProject: React.FC = () => {
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
          <div className="show-more">
            show more <IconArrowDown fill="#596782" />
          </div>
        </div>

        <div className="link-wrapper">
          <div className="key">Realm (Contract) Path</div>
          <div className="links">
            <LinkCard>
              <div className="text">gno.land/r/demo/gnoswap</div>
              <IconOpenLink size="16" />
            </LinkCard>
          </div>
        </div>

        <div className="link-wrapper">
          <div className="key">Links</div>
          <div className="links">
            <LinkCard>
              <div className="text">Website</div>
              <IconOpenLink size="16" />
            </LinkCard>
            <LinkCard>
              <div className="text">Gnoscan</div>
              <IconOpenLink size="16" />
            </LinkCard>
            <LinkCard>
              <div className="text">Twitter</div>
              <IconOpenLink size="16" />
            </LinkCard>
          </div>
        </div>
      </section>
    </LaunchpadAboutProjectWrapper>
  );
};

export default LaunchpadAboutProject;
