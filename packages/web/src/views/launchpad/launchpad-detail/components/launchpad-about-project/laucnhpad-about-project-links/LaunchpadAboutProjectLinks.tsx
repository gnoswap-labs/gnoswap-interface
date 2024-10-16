import React from "react";

import { wrapper } from "./LaunchpadAboutProjectLinks.styles";
import IconOpenLink from "@components/common/icons/IconOpenLink";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { ProjectLinksObject } from "@views/launchpad/launchpad-detail/LaunchpadDetail";
import { capitalize } from "@utils/string-utils";
import Link from "next/link";

interface LaunchpadAboutProjectLinksProps {
  isLoading: boolean;
  path: string;
  data: ProjectLinksObject;
}

const LaunchpadAboutProjectLinks: React.FC<LaunchpadAboutProjectLinksProps> = ({
  isLoading,
  path,
  data,
}) => {
  const excludedLinks = ["rewardTokenLogo"];

  return (
    <div css={wrapper}>
      <div className="contract-path">
        <h3>Realm (Contract) Path</h3>
        {!isLoading && (
          <button>
            <span>{path}</span>
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
            {Object.entries(data)
              .filter(([link]) => !excludedLinks.includes(link))
              .map(([link, value], idx) => {
                return (
                  <Link key={idx} href={value as string} target="_blank">
                    <button>
                      <span>{capitalize(link)}</span>
                      <IconOpenLink className="link-icon" />
                    </button>
                  </Link>
                );
              })}
          </div>
        )}
        {isLoading && <div css={pulseSkeletonStyle({ w: "150px", h: 20 })} />}
      </div>
    </div>
  );
};

export default LaunchpadAboutProjectLinks;
