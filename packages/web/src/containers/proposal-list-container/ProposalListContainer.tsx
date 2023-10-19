import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProposalList from "@components/governance/proposals-list/ProposalList";
import { useWindowSize } from "@hooks/common/use-window-size";

type ProposalStatus = "ACTIVE" | "REJECTED" | "PASSED" | "CANCELLED";
export type TypeVote = "" | "YES" | "NO" | "ABSTAIN";
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
  votingPower: number;
  icon: string;
  currency: string;
  description: string;
  typeVote: TypeVote;
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
    timeEnd: "2023-08-01, 12:00:00 UTC+9",
    abstainOfQuorum: 30,
    noOfQuorum: 20,
    currentValue: 20000,
    maxValue: 40000,
    yesOfQuorum: 50,
    votingPower: 14245,
    icon: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    currency: "USDC",
    typeVote: "YES",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nisiorci, ultrices sit amet mi eget, efficitur elementum tellus. Integeraugue purus, rutrum eu pretium sit amet, varius in quam.Lorem ipsumdolor sit amet, consectetur adipiscing elit. Phasellus nisi orci,ultrices sit amet mi eget, efficitur elementum tellus. Integer auguepurus, rutrum eu pretium sit amet, varius in quam.Lorem ipsum dolor sitamet, consectetur adipiscing elit. Phasellus nisi orci, ultrices sitamet mi eget, efficitur elementum tellus. Integer augue purus, rutrum eupretium sit amet, varius in quam.Lorem ipsum dolor sit amet, consecteturadipiscing elit. Phasellus nisi orci, ultrices sit amet mi eget,efficitur elementum tellus. Integer augue purus, rutrum eu pretium sitamet, varius in quam.Lorem ipsum dolor sit amet, consectetur adipiscingelit. Phasellus nisi orci, ultrices sit amet mi eget, efficiturelementum tellus. Integer augue purus, rutrum eu pretium sit amet,varius in quam.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Phasellus nisi orci, ultrices sit amet mi eget, efficitur elementumtellus. Integer augue purus, rutrum eu pretium sit amet, varius inquam.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellusnisi orci, ultrices sit amet mi eget, efficitur elementum tellus.Integer augue purus, rutrum eu pretium sit amet, varius in quam.Loremipsum dolor sit amet, consectetur adipiscing elit. Phasellus nisi orci,ultrices sit amet mi eget, efficitur elementum tellus. Integer auguepurus, rutrum eu pretium sit amet, varius in quam.Lorem ipsum dolor sitamet, consectetur adipiscing elit. Phasellus nisi orci, ultrices sitamet mi eget, efficitur elementum tellus. Integer augue purus, rutrum eupretium sit amet, varius in quam.Lorem ipsum dolor sit amet, consecteturadipiscing elit. Phasellus nisi orci, ultrices sit amet mi eget,efficitur elementum tellus. Integer augue purus, rutrum eu pretium sitamet, varius in quam.Lorem ipsum dolor sit amet, consectetur adipiscingelit. Phasellus nisi orci, ultrices sit amet mi eget, efficiturelementum tellus. Integer augue purus, rutrum eu pretium sit amet,varius in quam.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Phasellus nisi orci, ultrices sit amet mi eget, efficitur elementumtellus. Integer augue purus, rutrum eu pretium sit amet, varius inquam.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellusnisi orci, ultrices sit amet mi eget, efficitur elementum tellus.Integer augue purus, rutrum eu pretium sit amet, varius in quam.Loremipsum dolor sit amet, consectetur adipiscing elit. Phasellus nisi orci,ultrices sit amet mi eget, efficitur elementum tellus. Integer auguepurus, rutrum eu pretium sit amet, varius in quam.Lorem ipsum dolor sitamet, consectetur adipiscing elit. Phasellus nisi orci, ultrices sitamet mi eget, efficitur elementum tellus. Integer augue purus, rutrum eupretium sit amet, varius in quam.",
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

async function fetchProposalDetail() {
  return Promise.resolve(createDummyProposalItem());
}

const ProposalListContainer: React.FC = () => {
  const [isShowCancelled, toggleShowCancelled] = useState(false);
  const [isShowProposalModal, setIsShowProposalModal] = useState(false);
  const [isShowCreateProposal, setIsShowCreateProposal] = useState(false);
  const [isConnected] = useState(false);

  const { breakpoint } = useWindowSize();

  const { data: proposalList = [] } = useQuery<ProposalDetailProps[], Error>({
    queryKey: ["proposalList", isShowCancelled],
    queryFn: async () => {
      return await fetchListProposal(isShowCancelled);
    },
  });

  const { data: proposalDetail } = useQuery<ProposalDetailProps, Error>({
    queryKey: ["proposalDetail"],
    queryFn: async () => {
      return await fetchProposalDetail();
    },
    initialData: {
      id: Math.floor(Math.random() * 500 + 1).toString(),
      title: "#7 Proposal Title",
      label: "Community Pool Spend",
      status: "ACTIVE",
      timeEnd: "2023-08-01, 12:00:00 UTC+9",
      abstainOfQuorum: 30,
      noOfQuorum: 20,
      currentValue: 20000,
      maxValue: 40000,
      yesOfQuorum: 50,
      votingPower: 14245,
      icon: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
      currency: "xGNOS",
      typeVote: "",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nisiorci, ultrices sit amet mi eget, efficitur elementum tellus. Integeraugue purus, rutrum eu pretium sit amet, varius in quam.Lorem ipsumdolor sit amet, consectetur adipiscing elit. Phasellus nisi orci,ultrices sit amet mi eget, efficitur elementum tellus. Integer auguepurus, rutrum eu pretium sit amet, varius in quam.Lorem ipsum dolor sitamet, consectetur adipiscing elit. Phasellus nisi orci, ultrices sitamet mi eget, efficitur elementum tellus. Integer augue purus, rutrum eupretium sit amet, varius in quam.Lorem ipsum dolor sit amet, consecteturadipiscing elit. Phasellus nisi orci, ultrices sit amet mi eget,efficitur elementum tellus. Integer augue purus, rutrum eu pretium sitamet, varius in quam.Lorem ipsum dolor sit amet, consectetur adipiscingelit. Phasellus nisi orci, ultrices sit amet mi eget, efficiturelementum tellus. Integer augue purus, rutrum eu pretium sit amet,varius in quam.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Phasellus nisi orci, ultrices sit amet mi eget, efficitur elementumtellus. Integer augue purus, rutrum eu pretium sit amet, varius inquam.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellusnisi orci, ultrices sit amet mi eget, efficitur elementum tellus.Integer augue purus, rutrum eu pretium sit amet, varius in quam.Loremipsum dolor sit amet, consectetur adipiscing elit. Phasellus nisi orci,ultrices sit amet mi eget, efficitur elementum tellus. Integer auguepurus, rutrum eu pretium sit amet, varius in quam.Lorem ipsum dolor sitamet, consectetur adipiscing elit. Phasellus nisi orci, ultrices sitamet mi eget, efficitur elementum tellus. Integer augue purus, rutrum eupretium sit amet, varius in quam.Lorem ipsum dolor sit amet, consecteturadipiscing elit. Phasellus nisi orci, ultrices sit amet mi eget,efficitur elementum tellus. Integer augue purus, rutrum eu pretium sitamet, varius in quam.Lorem ipsum dolor sit amet, consectetur adipiscingelit. Phasellus nisi orci, ultrices sit amet mi eget, efficiturelementum tellus. Integer augue purus, rutrum eu pretium sit amet,varius in quam.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Phasellus nisi orci, ultrices sit amet mi eget, efficitur elementumtellus. Integer augue purus, rutrum eu pretium sit amet, varius inquam.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellusnisi orci, ultrices sit amet mi eget, efficitur elementum tellus.Integer augue purus, rutrum eu pretium sit amet, varius in quam.Loremipsum dolor sit amet, consectetur adipiscing elit. Phasellus nisi orci,ultrices sit amet mi eget, efficitur elementum tellus. Integer auguepurus, rutrum eu pretium sit amet, varius in quam.Lorem ipsum dolor sitamet, consectetur adipiscing elit. Phasellus nisi orci, ultrices sitamet mi eget, efficitur elementum tellus. Integer augue purus, rutrum eupretium sit amet, varius in quam.",
    },
  });

  const handleClickProposalDetail = () => {
    setIsShowProposalModal(true);
  };

  return (
    <ProposalList
      isConnected={isConnected}
      proposalList={proposalList}
      isShowCancelled={isShowCancelled}
      toggleShowCancelled={() => toggleShowCancelled(!isShowCancelled)}
      proposalDetail={proposalDetail}
      isShowProposalModal={isShowProposalModal}
      setIsShowProposalModal={() =>
        setIsShowProposalModal(!isShowProposalModal)
      }
      breakpoint={breakpoint}
      onClickProposalDetail={handleClickProposalDetail}
      isShowCreateProposal={isShowCreateProposal}
      setIsShowCreateProposal={() =>
        setIsShowCreateProposal(!isShowCreateProposal)
      }
    />
  );
};

export default ProposalListContainer;
