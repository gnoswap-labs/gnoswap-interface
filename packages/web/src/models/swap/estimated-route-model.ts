import { RouteModel } from "./route-model";

export interface EstimatedRouteModel extends RouteModel {
  quote: number;

  inputAmount: number;

  outputAmount: number;
}
