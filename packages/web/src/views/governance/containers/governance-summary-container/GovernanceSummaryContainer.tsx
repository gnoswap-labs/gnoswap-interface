import React from "react";

import { useGetGovernanceSummary } from "@query/governance";
import { nullGovernanceSummaryInfo } from "@repositories/governance";

import GovernanceSummary from "../../components/governance-summary/GovernanceSummary";

const GovernanceSummaryContainer: React.FC = () => {
  const { data: governanceSummaryInfo, isFetching } = useGetGovernanceSummary();

  return (
    <GovernanceSummary
      governanceSummary={governanceSummaryInfo ?? nullGovernanceSummaryInfo}
      isLoading={isFetching && !governanceSummaryInfo}
    />
  );
};

export default GovernanceSummaryContainer;
