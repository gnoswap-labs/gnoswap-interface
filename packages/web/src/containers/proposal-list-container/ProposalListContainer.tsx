// TODO : remove eslint-disable after work
/* eslint-disable */
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
  abstainOfQuorum: string;
  noOfQuorum: string;
  currentValue: number;
  maxValue: number;
  yesOfQuorum?: string;
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
    abstainOfQuorum: "70%",
    noOfQuorum: "60%",
    currentValue: Math.floor(Math.random() * 40000000),
    maxValue: 40000000,
    yesOfQuorum: '0%',
  };
};

async function fetchListProposal(
  isShowCancelled: boolean
): Promise<ProposalDetailProps[]> {
  return Promise.resolve([
    createDummyProposalItem(),
    createDummyProposalItem(),
    createDummyProposalItem(),
    createDummyProposalItem(),
    createDummyProposalItem(),
    createDummyProposalItem(),
    createDummyProposalItem(),
  ]);
}

const ProposalListContainer: React.FC = () => {
  const [isShowCancelled, toggleShowCancelled] = useState(false);

  const {
    isLoading: isProposalListLoading,
    error: proposalListError,
    data: proposalList = [],
  } = useQuery<ProposalDetailProps[], Error>({
    queryKey: ["proposalList", isShowCancelled],
    queryFn: async () => {
      const data = await fetchListProposal(isShowCancelled);
      return data.map(item => {
        return {
          ...item,
          yesOfQuorum: `${Math.round(item.currentValue * 100 /item.maxValue)}%`,
        }
      })
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
