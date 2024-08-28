
export interface ProposalsInfo {
  proposals: ProposalItemInfo[];
  pageInfo: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
  };
}

export type ProposalItemInfo = {
  id: number;
  status: string;
  type: string;
  title: string;
  description: string;
  proponent: string;
  time: string;
  myVote?: string;
  votes: {
    max: number;
    yes: number;
    no: number;
  };
};

export const nullProposalItemInfo: ProposalItemInfo = {
  id: 0,
  status: "",
  type: "",
  title: "",
  description: "",
  proponent: "",
  time: "",
  myVote: "",
  votes: {
    max: 0,
    yes: 0,
    no: 0,
  },
};