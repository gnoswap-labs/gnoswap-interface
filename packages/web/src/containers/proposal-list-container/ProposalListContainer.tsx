import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProposalList from "@components/governance/proposals-list/ProposalList";

type ProposalStatus = "ACTIVE" | "REJECTED" | "PASSED" | "CANCELLED";

export interface ProposalDetailProps {
  id: string;
  title: string;
  label: string;
  status: ProposalStatus;
  timeEnd: string;
  abstainOfQuorum: number;
  noOfQuorum: number;
  currentValue: number;
  maxValue: number;
  yesOfQuorum: number;
}

const statusArray = ["ACTIVE", "REJECTED", "PASSED", "CANCELLED"];

export const createDummyProposalItem = (): ProposalDetailProps => {
  return {
    id: Math.floor(Math.random() * 500 + 1).toString(),
    title: "#7 Proposal Title",
    label: "Community Pool Spend",
    status: statusArray[
      Math.floor(Math.random() * statusArray.length)
    ] as ProposalStatus,
    timeEnd: "Voting Ends in 9 hours (2023-08-01, 12:00:00 UTC+9)",
    abstainOfQuorum: 30,
    noOfQuorum: 20,
    currentValue: 20000000,
    maxValue: 40000000,
    yesOfQuorum: 50,
  };
};

async function fetchListProposal(
  isShowCancelled: boolean,
): Promise<ProposalDetailProps[]> {
  const data = [
    createDummyProposalItem(),
    createDummyProposalItem(),
    createDummyProposalItem(),
    createDummyProposalItem(),
    createDummyProposalItem(),
    createDummyProposalItem(),
    createDummyProposalItem(),
  ];
  if (isShowCancelled) return data.filter(item => item.status === "CANCELLED");
  return Promise.resolve(data);
}

const ProposalListContainer: React.FC = () => {
  const [isShowCancelled, toggleShowCancelled] = useState(false);

  const { data: proposalList = [] } = useQuery<ProposalDetailProps[], Error>({
    queryKey: ["proposalList", isShowCancelled],
    queryFn: async () => {
      return await fetchListProposal(isShowCancelled);
    },
  });

  return (
    <ProposalList
      proposalList={proposalList}
      isShowCancelled={isShowCancelled}
      toggleShowCancelled={() => toggleShowCancelled(!isShowCancelled)}
    />
  );
};

export default ProposalListContainer;
