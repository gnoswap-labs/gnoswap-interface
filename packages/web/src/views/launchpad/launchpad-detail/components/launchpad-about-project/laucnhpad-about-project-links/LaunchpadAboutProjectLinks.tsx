import React from "react";

import { wrapper } from "./LaunchpadAboutProjectLinks.styles";
import IconOpenLink from "@components/common/icons/IconOpenLink";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";

interface LaunchpadAboutProjectLinksProps {
  isLoading: boolean;
  // links: { [key: string]: string };
}

const LaunchpadAboutProjectLinks: React.FC<LaunchpadAboutProjectLinksProps> = ({
  isLoading,
}) => {
  return (
    <div css={wrapper}>
      <div className="contract-path">
        <h3>Realm (Contract) Path</h3>
        {!isLoading && (
          <button>
            <span>path</span>
            <div className="icon-wrapper">
              <IconOpenLink className="link-icon" />
            </div>
          </button>
        )}
        {isLoading && <div css={pulseSkeletonStyle({ w: "150px", h: 20 })} />}
      </div>

      <div className="link">
        <h3>Links</h3>
        {!isLoading && (
          <div className="group-button">
            <button>
              <span>link1</span>
              <IconOpenLink className="link-icon" />
            </button>
            <button>
              <span>link2</span>
              <IconOpenLink className="link-icon" />
            </button>
            {/* {Object.keys(links)?.map((link, idx) =>
              links[link] ? (
                <button key={idx} onClick={() => onClickLink(links[link])}>
                  <span>{link}</span>
                  <IconOpenLink className="link-icon" />
                </button>
              ) : null,
            )} */}
          </div>
        )}
        {isLoading && <div css={pulseSkeletonStyle({ w: "150px", h: 20 })} />}
      </div>
    </div>
  );
};

export default LaunchpadAboutProjectLinks;
