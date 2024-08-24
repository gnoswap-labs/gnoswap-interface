import React from "react";
import { useTranslation } from "react-i18next";
import { ValuesType } from "utility-types";

import SelectTabV2 from "@components/common/select-tab-v2/SelectTabV2";

import { ActivityListHeaderwrapper } from "./ActivityListHeader.styles";

export const ACTIVITY_TYPE = {
  ALL: "All",
  SWAPS: "Swaps",
  ADDS: "Adds",
  REMOVES: "Removes",
  STAKES: "Stakes",
  UNSTAKE: "Unstakes",
  CLAIM: "Claims",
} as const;
export type ACTIVITY_TYPE = ValuesType<typeof ACTIVITY_TYPE>;

export const ACTIVITY_SWITCH_DATA = [
  { key: ACTIVITY_TYPE.ALL, display: "Dashboard:onchainActi.switch.all" },
  { key: ACTIVITY_TYPE.SWAPS, display: "Dashboard:onchainActi.switch.swap" },
  { key: ACTIVITY_TYPE.ADDS, display: "Dashboard:onchainActi.switch.add" },
  {
    key: ACTIVITY_TYPE.REMOVES,
    display: "Dashboard:onchainActi.switch.remove",
  },
  { key: ACTIVITY_TYPE.STAKES, display: "Dashboard:onchainActi.switch.stake" },
  {
    key: ACTIVITY_TYPE.UNSTAKE,
    display: "Dashboard:onchainActi.switch.unstake",
  },
  {
    key: ACTIVITY_TYPE.CLAIM,
    display: "Dashboard:onchainActi.switch.claim",
  },
];

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
