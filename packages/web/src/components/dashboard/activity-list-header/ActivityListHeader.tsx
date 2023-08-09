import React from "react";
import SelectTab from "@components/common/select-tab/SelectTab";
import { ACTIVITY_TYPE } from "@containers/dashboard-activities-container/DashboardActivitiesContainer";
import { ActivityListHeaderwrapper } from "./ActivityListHeader.styles";

interface ActivityListHeaderProps {
  activityType: ACTIVITY_TYPE;
  changeActivityType: (newType: string) => void;
}

const ActivityListHeader: React.FC<ActivityListHeaderProps> = ({
  activityType,
  changeActivityType,
}) => (
  <ActivityListHeaderwrapper>
    <h2>Activities</h2>
    <div className="overflow-tab">
      <SelectTab
        selectType={activityType}
        list={Object.values(ACTIVITY_TYPE)}
        onClick={changeActivityType}
      />
    </div>
  </ActivityListHeaderwrapper>
);

export default ActivityListHeader;
