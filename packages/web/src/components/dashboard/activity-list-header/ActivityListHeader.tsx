import React from "react";
import SelectTab from "@components/common/select-tab/SelectTab";
import { ACTIVITY_TYPE } from "@containers/dashboard-activities-container/DashboardActivitiesContainer";
import { wrapper } from "./ActivityListHeader.styles";

interface ActivityListHeaderProps {
  activityType: ACTIVITY_TYPE;
  changeActivityType: (newType: string) => void;
}

const ActivityListHeader: React.FC<ActivityListHeaderProps> = ({
  activityType,
  changeActivityType,
}) => (
  <div css={wrapper}>
    <h2>Activities</h2>
    <SelectTab
      selectType={activityType}
      list={Object.values(ACTIVITY_TYPE)}
      onClick={changeActivityType}
    />
  </div>
);

export default ActivityListHeader;
