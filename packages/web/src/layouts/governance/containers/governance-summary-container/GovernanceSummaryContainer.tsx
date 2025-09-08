import React from "react";

import { useGetGovernanceSummary, useGetCommunityPoolBalances } from "@query/governance";
import { nullGovernanceSummaryInfo } from "@repositories/governance";

import GovernanceSummary from "../../components/governance-summary/GovernanceSummary";

const GovernanceSummaryContainer: React.FC = () => {
  const { data: governanceSummaryInfo, isFetched } = useGetGovernanceSummary();
  const { data: governanceCommunityPoolBalances } = useGetCommunityPoolBalances();

  const communityPoolBalacnes = React.useMemo(() => {
    if (!governanceCommunityPoolBalances) return [];
    return governanceCommunityPoolBalances.balances;
  }, [governanceCommunityPoolBalances]);

  return (
    <GovernanceSummary
      governanceSummary={governanceSummaryInfo ?? nullGovernanceSummaryInfo}
      governanceCommunityPoolBalances={communityPoolBalacnes}
      isLoading={!isFetched && !governanceSummaryInfo}
    />
  );
};

export default GovernanceSummaryContainer;
