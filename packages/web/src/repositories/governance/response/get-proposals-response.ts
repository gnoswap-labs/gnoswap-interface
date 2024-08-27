
export interface GetProposalsResponse {
  proposals: Proposal[];
}

export type Proposal = {
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
