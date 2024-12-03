import React from "react";

import { ThemeKeys } from "@styles/ThemeTypes";

import { useGetLaunchpadSummary } from "@query/launchpad/use-get-launchpad-summary";
import LaunchpadMain from "src/layouts/launchpad/components/launchpad-main/LaunchpadMain";
import { useWindowSize } from "@hooks/common/use-window-size";

interface LaunchpadMainContainerProps {
  themeKey: ThemeKeys;
  icon: React.ReactNode;
}

const LaunchpadMainContainer: React.FC<LaunchpadMainContainerProps> = ({ themeKey, icon }) => {
  const { data: launchpadSummary, isLoading: isLoadingSummary, isFetched: isFetchedSummary } = useGetLaunchpadSummary();

  const { breakpoint } = useWindowSize();

  return (
    <LaunchpadMain
      data={launchpadSummary}
      isLoading={isLoadingSummary}
      isFetched={isFetchedSummary}
      breakpoint={breakpoint}
      themeKey={themeKey}
      icon={icon}
    />
  );
};

export default LaunchpadMainContainer;
