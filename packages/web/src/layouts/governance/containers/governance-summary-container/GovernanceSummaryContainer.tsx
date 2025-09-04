import React from "react";

import { nullGovernanceSummaryInfo2 } from "@repositories/governance";

import GovernanceSummary from "../../components/governance-summary/GovernanceSummary";
import { useGetGovernanceSummary2 } from "@query/governance";

const GovernanceSummaryContainer: React.FC = () => {
  const { data: governanceSummaryInfo, isFetched } = useGetGovernanceSummary2();

  return (
    <GovernanceSummary
      governanceSummary={governanceSummaryInfo ?? nullGovernanceSummaryInfo2}
      isLoading={!isFetched && !governanceSummaryInfo}
    />
  );
};

export default GovernanceSummaryContainer;
