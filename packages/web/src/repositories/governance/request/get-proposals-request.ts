export interface GetProposalsReqeust {
  isActive: boolean;
  address?: string;
  offset: number;
  limit: number;
}