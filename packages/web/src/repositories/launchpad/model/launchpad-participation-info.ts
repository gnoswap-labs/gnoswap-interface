import { LaunchpadParticipationModel } from "@models/launchpad";

export interface LaunchpadParticipationInfo {
  participationInfos: LaunchpadParticipationModel[];
}

// null objects
export const nullLaunchpadParticipationInfo: LaunchpadParticipationInfo = {
  participationInfos: [],
};
