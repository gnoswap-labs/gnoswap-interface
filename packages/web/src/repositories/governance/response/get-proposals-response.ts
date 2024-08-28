
export interface GetProposalsResponse {
  proposals: ProposalItemResponse[];
  pageInfo: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
  };
}

export type ProposalItemResponse = {
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
  }
}
