import { PositionModel } from "@models/position/position-model";

export interface ClaimRequest {
  position: PositionModel;

  recipient: string;

  gasFee?: string;

  gasUsed?: string;
}
