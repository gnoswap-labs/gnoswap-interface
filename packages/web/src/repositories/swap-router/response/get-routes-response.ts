import { EstimatedRoute } from "@models/swap/swap-route-info";

export interface GetRoutesResponse {
  estimatedRoutes: EstimatedRoute[];
  /**
   * Final quote as a raw integer string, with the router fee already applied.
   * EXACT_IN: the output received. EXACT_OUT: the input required.
   */
  amount: string;
  /**
   * Router fee as a raw integer string in units of the OUTPUT token, for both exact modes.
   * Pool fees are excluded. Already reflected in `amount`; it is for display only.
   */
  feeAmount: string;
  status: "SUCCESS" | "NO_LIQUIDITY" | "INVALID_PARAMS";
}
