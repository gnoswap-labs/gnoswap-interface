import React from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import IconArrowRight from "@components/common/icons/IconArrowRight";
import { DetailClickHereWrapper, LinkButton } from "./LaunchpadDetailClickHere.styles";

const LaunchpadDetailClickHere = () => {
  const { t } = useTranslation();

  return (
    <DetailClickHereWrapper>
      <LinkButton>
        <span>{t("Launchpad:clickHere.text")}</span>
        <Link href="/swap?to=gno.land/r/gnoswap/v2/gns">
          {t("Launchpad:clickHere.button")} <IconArrowRight />
        </Link>
      </LinkButton>
    </DetailClickHereWrapper>
  );
};

export default LaunchpadDetailClickHere;
