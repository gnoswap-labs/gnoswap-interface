// TODO : remove eslint-disable after work
/* eslint-disable */
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import GovernanceSummary from "@components/governance/governance-summary/GovernanceSummary";

export interface GovernanceDetailInfoProps {
  totalXGnosIssued: string;
  communityPool: string;
  passedProposals: string;
  activeProposals: string;
}

const initialGovernanceDetailInfo: GovernanceDetailInfoProps = {
  totalXGnosIssued: "59,144,225",
  communityPool: "2,412,148",
  passedProposals: "42",
  activeProposals: "2",
};

async function fetchGovernanceDetailInfo(): Promise<GovernanceDetailInfoProps> {
  return new Promise(resolve => setTimeout(resolve, 2000)).then(
    () => initialGovernanceDetailInfo,
  );
}

const GovernanceContainer: React.FC = () => {
  const { data: governanceDetailInfo, isFetching } = useQuery<
    GovernanceDetailInfoProps,
    Error
  >({
    queryKey: ["governanceDetailInfo"],
    queryFn: () => {
      return fetchGovernanceDetailInfo();
    },
  });
  return (
    <GovernanceSummary
      loading={isFetching}
      governanceDetailInfo={governanceDetailInfo}
    />
  );
};

export default GovernanceContainer;
