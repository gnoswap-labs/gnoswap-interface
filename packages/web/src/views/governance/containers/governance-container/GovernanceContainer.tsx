import { useQuery } from "@tanstack/react-query";
import React from "react";

import { GovernanceDetailData } from "../../components/governance-summary/governance-detail/governance-detail-info/GovernanceDetailInfo";
import GovernanceSummary from "../../components/governance-summary/GovernanceSummary";

const dummyGovernanceDetailInfo: GovernanceDetailData = {
  totalXGnosIssued: "59,144,225",
  communityPool: "2,412,148",
  passedProposals: "42",
  activeProposals: "2",
};

async function fetchGovernanceDetailInfo(): Promise<GovernanceDetailData> {
  return new Promise(resolve => setTimeout(resolve, 2000)).then(
    () => dummyGovernanceDetailInfo,
  );
}

const GovernanceContainer: React.FC = () => {
  const { data: governanceDetailInfo, isFetching } = useQuery<
    GovernanceDetailData,
    Error
  >({
    queryKey: ["governanceDetailInfo"],
    queryFn: () => {
      return fetchGovernanceDetailInfo();
    },
  });

  return (
    <GovernanceSummary
      isLoading={isFetching}
      governanceDetailInfo={governanceDetailInfo}
    />
  );
};

export default GovernanceContainer;
