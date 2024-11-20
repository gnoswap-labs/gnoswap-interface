import React from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { ProjectLinksObject } from "@views/launchpad/launchpad-detail/LaunchpadDetail";
import { capitalize } from "@utils/string-utils";
import { removePoolPathUrl } from "@utils/launchpad-remove-pool-path-url";

import { wrapper } from "./LaunchpadAboutProjectLinks.styles";
import IconOpenLink from "@components/common/icons/IconOpenLink";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { useGnoscanUrl } from "@hooks/common/use-gnoscan-url";

interface LaunchpadAboutProjectLinksProps {
  isLoading: boolean;
  path: string;
  data: ProjectLinksObject;
}

const LaunchpadAboutProjectLinks: React.FC<LaunchpadAboutProjectLinksProps> = ({ isLoading, path, data }) => {
  const { t } = useTranslation();

  const excludedLinks = ["rewardTokenLogo"];
  const { getRealmUrl } = useGnoscanUrl();
  const poolPath = removePoolPathUrl(path);

  const renderLinkButton = (link: string, value: string) => (
    <Link key={link} href={value} target="_blank">
      <button>
        <span>{link === "twitter" ? "X" : capitalize(link)}</span>
        <IconOpenLink className="link-icon" />
      </button>
    </Link>
  );

  return (
    <div css={wrapper}>
      <div className="contract-path">
        <h3>{t("Launchpad:aboutProject.realmPath")}</h3>
        {!isLoading && (
          <Link href={getRealmUrl(poolPath)} target="_blank">
            <button>
              <span>{path.replace(/:\d+/g, "")}</span>
              <div className="icon-wrapper">
                <IconOpenLink className="link-icon" />
              </div>
            </button>
          </Link>
        )}
        {isLoading && <div css={pulseSkeletonStyle({ w: 150, h: 20 })} />}
      </div>

      <div className="link">
        <h3>{t("Launchpad:aboutProject.links")}</h3>
        {!isLoading && (
          <div className="group-button">
            {Object.entries(data)
              .filter(([link]) => !excludedLinks.includes(link))
              .map(([link, value]) => renderLinkButton(link, value as string))}
          </div>
        )}
        {isLoading && <div css={pulseSkeletonStyle({ w: 150, h: 20 })} />}
      </div>
    </div>
  );
};

export default LaunchpadAboutProjectLinks;
