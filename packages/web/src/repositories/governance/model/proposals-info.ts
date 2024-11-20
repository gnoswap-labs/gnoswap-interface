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
  proposer: {
    name: string;
    address: string;
  };
  time: string;
  executableTime?: string | null;
  expiredTime?: string | null;
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

export const nullProposalsInfo: ProposalsInfo = {
  proposals: [],
  pageInfo: {
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
  },
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
  proposer: {
    name: "",
    address: "",
  },
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
