import IconArrowRight from "@components/common/icons/IconArrowRight";
import React from "react";
import { DetailClickHereWrapper } from "./LaunchpadDetailClickHere.styles";

const LaunchpadDetailClickHere = () => {
  return (
    <DetailClickHereWrapper>
      <div className="text">Swap GNS to participate in the launchpad.</div>
      <button>
        Click here <IconArrowRight />
      </button>
    </DetailClickHereWrapper>
  );
};

export default LaunchpadDetailClickHere;
