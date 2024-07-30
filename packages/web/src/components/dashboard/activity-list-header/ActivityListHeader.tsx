import React from "react";
import {
  ACTIVITY_SWITCH_DATA,
  ACTIVITY_TYPE,
} from "@containers/dashboard-activities-container/DashboardActivitiesContainer";
import { ActivityListHeaderwrapper } from "./ActivityListHeader.styles";
import SelectTabV2 from "@components/common/select-tab-v2/SelectTabV2";
import { useTranslation } from "react-i18next";

interface ActivityListHeaderProps {
  activityType: ACTIVITY_TYPE;
  changeActivityType: ({
    display,
    key,
  }: {
    display: string;
    key: string;
  }) => void;
}

const ActivityListHeader: React.FC<ActivityListHeaderProps> = ({
  activityType,
  changeActivityType,
}) => {
  const { t } = useTranslation();

  return (
    <ActivityListHeaderwrapper>
      <h2>{t("Dashboard:onchainActi.title")}</h2>
      <div className="overflow-tab">
        <SelectTabV2
          selectType={activityType}
          list={ACTIVITY_SWITCH_DATA.map(item => ({
            ...item,
            display: t(item.display),
          }))}
          onClick={changeActivityType}
        />
      </div>
    </ActivityListHeaderwrapper>
  );
};

export default ActivityListHeader;
