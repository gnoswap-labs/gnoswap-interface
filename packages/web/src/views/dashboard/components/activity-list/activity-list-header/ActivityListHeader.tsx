import React from "react";
import { useTranslation } from "react-i18next";

import SelectTabV2 from "@components/common/select-tab-v2/SelectTabV2";
import { ActivityType } from "@repositories/dashboard";

import { ActivityListHeaderwrapper } from "./ActivityListHeader.styles";

export const ACTIVITY_SWITCH_DATA = [
  { key: ActivityType.ALL, display: "Dashboard:onchainActi.switch.all" },
  { key: ActivityType.SWAP, display: "Dashboard:onchainActi.switch.swap" },
  { key: ActivityType.ADD, display: "Dashboard:onchainActi.switch.add" },
  {
    key: ActivityType.REMOVE,
    display: "Dashboard:onchainActi.switch.remove",
  },
  { key: ActivityType.STAKE, display: "Dashboard:onchainActi.switch.stake" },
  {
    key: ActivityType.UNSTAKE,
    display: "Dashboard:onchainActi.switch.unstake",
  },
  {
    key: ActivityType.CLAIM,
    display: "Dashboard:onchainActi.switch.claim",
  },
];

interface ActivityListHeaderProps {
  activityType: ActivityType;
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
