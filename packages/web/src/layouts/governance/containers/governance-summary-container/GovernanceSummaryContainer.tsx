import React from "react";

import { useGetGovernanceSummary2, useGetCommunityPoolBalances } from "@query/governance";
import { nullGovernanceSummaryInfo2 } from "@repositories/governance";

import GovernanceSummary from "../../components/governance-summary/GovernanceSummary";

const GovernanceSummaryContainer: React.FC = () => {
  const { data: governanceSummaryInfo, isFetched } = useGetGovernanceSummary2();
  const { data: governanceCommunityPoolBalances } = useGetCommunityPoolBalances();

  const communityPoolBalacnes = React.useMemo(() => {
    if (!governanceCommunityPoolBalances) return [];
    return governanceCommunityPoolBalances.balances;
  }, [governanceCommunityPoolBalances]);

  return (
    <GovernanceSummary
      governanceSummary={governanceSummaryInfo ?? nullGovernanceSummaryInfo2}
      governanceCommunityPoolBalances={communityPoolBalacnes}
      isLoading={!isFetched && !governanceSummaryInfo}
    />
  );
};

export default GovernanceSummaryContainer;
