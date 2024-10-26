import React from "react";
import Link from "next/link";

import IconArrowRight from "@components/common/icons/IconArrowRight";
import {
  DetailClickHereWrapper,
  LinkButton,
} from "./LaunchpadDetailClickHere.styles";

const LaunchpadDetailClickHere = () => {
  return (
    <DetailClickHereWrapper>
      <LinkButton>
        <span>Swap GNS to participate in the launchpad.</span>
        <Link href="/swap?to=gno.land/r/gnoswap/v2/gns">
          Click here <IconArrowRight />
        </Link>
      </LinkButton>
    </DetailClickHereWrapper>
  );
};

export default LaunchpadDetailClickHere;
