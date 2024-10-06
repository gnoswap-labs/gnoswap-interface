import React from "react";
import { ValuesType } from "utility-types";

import IconTimer from "@components/common/icons/IconTimer";

import { ActiveProjectCardTimeChip } from "./LaunchpadActiveProjectCardTimeChip.styles";

interface LaunchpadActiveProjectCardTimeChipProps {
  type: PROJECT_STATUS_TYPE;
}

export const PROJECT_STATUS_TYPE = {
  UPCOMING: "Upcoming",
  END: "End",
};
export type PROJECT_STATUS_TYPE = ValuesType<typeof PROJECT_STATUS_TYPE>;

const LaunchpadActiveProjectCardTimeChip: React.FC<
  LaunchpadActiveProjectCardTimeChipProps
> = ({ type = PROJECT_STATUS_TYPE.UPCOMING }) => {
  return (
    <ActiveProjectCardTimeChip type={type}>
      <IconTimer type={type} />
      <div>{`${type} in 5 days 17 hours`}</div>
    </ActiveProjectCardTimeChip>
  );
};

export default LaunchpadActiveProjectCardTimeChip;
