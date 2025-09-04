export const PROPOSAL_TYPE = {
  PROPOSAL_TEXT: "PROPOSAL_TEXT",
  PROPOSAL_COMMUNITY_POOL_SPEND: "PROPOSAL_COMMUNITY_POOL_SPEND",
  PROPOSAL_PARAMETER_CHANGE: "PROPOSAL_PARAMETER_CHANGE",
} as const;

export type ProposalType = (typeof PROPOSAL_TYPE)[keyof typeof PROPOSAL_TYPE];

export interface Proposals2PageInfo {
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

export interface ProposerInfo {
  address: string;
  name: string;
}

export interface VotingInfo {
  maxVotingWeight: string;
  yesVotingWeight: string;
  noVotingWeight: string;
  quorumAmount: string;
}

export interface UserVotingInfo {
  isVoted: boolean;
  voteType: "YES" | "NO";
  votingWeight: number;
}

export interface Proposal2ItemInfo {
  id: number;
  proposalType: ProposalType;
  title: string;
  proposer: ProposerInfo;
  status: string;
  executableTime: string;
  expiredTime: string;
  createdAt: string;
  votingInfo: VotingInfo;
  userVotingInfo: UserVotingInfo;
}

export interface Proposals2Info {
  proposals: Proposal2ItemInfo[];
  pageInfo: Proposals2PageInfo;
}

export const nullProposals2Info: Proposals2Info = {
  proposals: [],
  pageInfo: {
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
  },
};

// Null-Objects
export const nullProposerInfo: ProposerInfo = {
  address: "",
  name: "",
};

export const nullVotingInfo: VotingInfo = {
  maxVotingWeight: "0",
  yesVotingWeight: "0",
  noVotingWeight: "0",
  quorumAmount: "0",
};

export const nullUserVotingInfo: UserVotingInfo = {
  isVoted: false,
  voteType: "NO",
  votingWeight: 0,
};

export const nullProposal2ItemInfo: Proposal2ItemInfo = {
  id: 0,
  proposalType: PROPOSAL_TYPE.PROPOSAL_TEXT,
  title: "",
  proposer: nullProposerInfo,
  status: "",
  executableTime: "",
  expiredTime: "",
  createdAt: "",
  votingInfo: nullVotingInfo,
  userVotingInfo: nullUserVotingInfo,
};
