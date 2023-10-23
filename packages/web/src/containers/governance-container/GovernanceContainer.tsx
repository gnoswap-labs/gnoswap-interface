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
  return Promise.resolve({
    totalXGnosIssued: "59,144,225",
    communityPool: "2,412,148",
    passedProposals: "42",
    activeProposals: "2",
  });
}

const GovernanceContainer: React.FC = () => {
  const {
    data: governanceDetailInfo,
  } = useQuery<GovernanceDetailInfoProps, Error>({
    queryKey: ["governanceDetailInfo"],
    queryFn: () => {
      return fetchGovernanceDetailInfo();
    },
    initialData: initialGovernanceDetailInfo,
  });

  return <GovernanceSummary governanceDetailInfo={governanceDetailInfo} />;
};

export default GovernanceContainer;
