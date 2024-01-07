import { CandidatePoolsBySelectionCriteria } from "../../../functions/get-candidate-pools";
import { V3Route } from "../../../router";

export interface GetRoutesResult<Route extends V3Route> {
  routes: Route[];
  candidatePools: CandidatePoolsBySelectionCriteria;
}
