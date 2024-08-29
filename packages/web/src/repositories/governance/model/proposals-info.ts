
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
  title: string;
  type: string;
  proponent: string;
  time: string;
  votes: {
    max: number;
    yes: number;
    no: number;
  }
}