import { PositionBinResponse } from "@repositories/position/response";
import { PositionBinModel } from "../position-bin-model";

export class PositionBinMapper {
  public static from(res: PositionBinResponse): PositionBinModel {
    return {
      ...res
    };
  }

  public static fromList(res: PositionBinResponse[]): PositionBinModel[] {
    return res.map(PositionBinMapper.from);
  }
}
