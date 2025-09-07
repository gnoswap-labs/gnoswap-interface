export interface LaunchpadSummaryInfo {
  totalDepositedGNSAmount: number;
  totalParticipants: number;
  totalDistributedAmount: number;
}

export const nullLaunchpadSummaryInfo: LaunchpadSummaryInfo = {
  totalDepositedGNSAmount: 0,
  totalParticipants: 0,
  totalDistributedAmount: 0,
};
