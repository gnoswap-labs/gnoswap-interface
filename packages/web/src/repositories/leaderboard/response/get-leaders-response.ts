import { Leader } from "./common/types";

export interface GetLeadersResponse {
  leaders: Leader[];
  totalPage: number;
  currentPage: number;
}
