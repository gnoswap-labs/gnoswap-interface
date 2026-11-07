export interface GetDcaScheduleRequest {
  inputToken: string;
  outputToken: string;
  /** Interval between executions, in seconds. */
  interval: number;
  executionCount: number;
}
