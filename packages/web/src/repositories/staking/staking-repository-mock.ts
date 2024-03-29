import { generateTxHash } from "@common/utils/test-util";
import { StakeResponse, StakingRepository, UnstakeResponse } from ".";

export class StakingRepositoryMock implements StakingRepository {
  public stakeBy = async (): Promise<StakeResponse> => {
    return {
      tx_hash: generateTxHash(),
    };
  };

  public unstakeBy = async (): Promise<UnstakeResponse> => {
    return {
      tx_hash: generateTxHash(),
    };
  };
}
