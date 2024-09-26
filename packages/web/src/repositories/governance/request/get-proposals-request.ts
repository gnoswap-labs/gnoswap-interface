export interface GetProposalsReqeust {
  isActive: boolean;
  address?: string;
  page: number;
  itemsPerPage: number;
}