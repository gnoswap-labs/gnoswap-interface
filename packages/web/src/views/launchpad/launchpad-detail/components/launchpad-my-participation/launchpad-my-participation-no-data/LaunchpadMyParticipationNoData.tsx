import React from "react";
import Image from "next/image";
import { useTranslation, Trans } from "react-i18next";

import { ParticipationNoDataWrapper } from "./LaunchpadMyParticipationNoData.styles";

interface LaunchpadMyParticipationNoDataProps {
  highestApr: number;
}

const LaunchpadMyParticipationNoData = ({
  highestApr,
}: LaunchpadMyParticipationNoDataProps) => {
  const { t } = useTranslation();

  return (
    <ParticipationNoDataWrapper>
      <Image
        src={"/gnoscan-banner-logo.png"}
        width={70}
        height={85}
        style={{ objectFit: "cover", marginLeft: "-18px" }}
        alt="gnoscan banner logo"
      />
      <div className="banner-text">
        <div className="banner-text-description">
          <Trans
            ns="Launchpad"
            i18nKey="myParticipation.nodata.text1"
            components={{ span: <span /> }}
          >
            Deposit <span>GNS</span>
          </Trans>
        </div>
        <div className="banner-text-description">
          {t("Launchpad:myParticipation.nodata.text2")}
        </div>
        <div className="banner-text-description">
          <span>
            {t("Launchpad:myParticipation.nodata.text3", {
              apr: highestApr.toLocaleString() || 0,
            })}
          </span>
        </div>
      </div>
    </ParticipationNoDataWrapper>
  );
};

export default LaunchpadMyParticipationNoData;
