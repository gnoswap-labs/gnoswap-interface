import React from "react";

import { useGetGovernanceSummary, useGetCommunityPoolBalances } from "@query/governance";
import { nullGovernanceSummaryInfo } from "@repositories/governance";

import GovernanceSummary from "../../components/governance-summary/GovernanceSummary";

interface GovernanceSummaryContainerProps {
  onOpenVideoGuide: (type: "GOVERNANCE") => void;
}

const GovernanceSummaryContainer: React.FC<GovernanceSummaryContainerProps> = ({ onOpenVideoGuide }) => {
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
      onOpenVideoGuide={onOpenVideoGuide}
    />
  );
};

export default GovernanceSummaryContainer;
