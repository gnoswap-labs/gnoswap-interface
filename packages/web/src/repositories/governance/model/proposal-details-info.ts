import {
  nullProposerInfo,
  nullUserVotingInfo,
  nullVotingInfo,
  PROPOSAL_TYPE,
  ProposalType,
  ProposerInfo,
  UserVotingInfo,
  VotingInfo,
} from "./proposals-info";

export interface ProposalContent {
  amount: string;
  description: string;
  parameters: ParameterInfo[];
  recipient: string;
}

export interface ParameterInfo {
  func: string;
  param: string;
  pkgPath: string;
}

export interface ProposalDetailsItemInfo {
  id: number;
  proposalType: ProposalType;
  title: string;
  content: ProposalContent;
  proposer: ProposerInfo;
  status: string;
  executableTime: string;
  expiredTime: string;
  createdAt: string;
  votingInfo: VotingInfo;
  userVotingInfo: UserVotingInfo;
}

export interface ProposalDetailsInfo {
  proposal: ProposalDetailsItemInfo;
}

// null objects
export const nullParameterInfo: ParameterInfo = {
  func: "",
  param: "",
  pkgPath: "",
};

export const nullProposalContent: ProposalContent = {
  amount: "0",
  description: "",
  parameters: [],
  recipient: "",
};

export const nullProposalDetailsItemInfo: ProposalDetailsItemInfo = {
  id: 0,
  proposalType: PROPOSAL_TYPE.PROPOSAL_TEXT,
  title: "",
  content: nullProposalContent,
  proposer: nullProposerInfo,
  status: "",
  executableTime: "",
  expiredTime: "",
  createdAt: "",
  votingInfo: nullVotingInfo,
  userVotingInfo: nullUserVotingInfo,
};

export const nullProposalDetailsInfo: ProposalDetailsInfo = {
  proposal: nullProposalDetailsItemInfo,
};
