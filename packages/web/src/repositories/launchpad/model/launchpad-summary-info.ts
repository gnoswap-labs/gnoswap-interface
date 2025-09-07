export interface LaunchpadSummaryInfo {
  totalDepositedGNSAmount: number;
  totalParticipants: number;
  totalDistributedAmount: number;
}

// null objects
export const nullLaunchpadSummaryInfo: LaunchpadSummaryInfo = {
  totalDepositedGNSAmount: 0,
  totalParticipants: 0,
  totalDistributedAmount: 0,
};
