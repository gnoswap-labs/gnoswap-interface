
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
  content: {
    description: string;
    recipient?: string;
    amount?: number;
    parameters?: {
      pkgPath: string;
      func: string;
      param: string;
    }[];
  };
  proponent: string;
  time: string;
  myVote?: {
    type: string;
    weight: number;
  };
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
  content: {
    description: "",
    recipient: "",
    amount: 0,
    parameters: [
      {
        pkgPath: "",
        func: "",
        param: "",
      },
    ],
  },
  proponent: "",
  time: "",
  myVote: {
    type: "",
    weight: 0,
  },
  votes: {
    max: 0,
    yes: 0,
    no: 0,
  },
};