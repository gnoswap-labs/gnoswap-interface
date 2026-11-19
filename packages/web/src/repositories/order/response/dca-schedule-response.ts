export interface DcaScheduleResponse {
  groupId: string;
  slotOffset: number;
  groupActive: boolean;
  /** Unix seconds. */
  firstExecutionAt: number;
  /** Unix seconds. */
  estimatedEndAt: number;
}
