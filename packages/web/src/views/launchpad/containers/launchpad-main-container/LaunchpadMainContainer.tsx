import React from "react";

import { ThemeKeys } from "@styles/ThemeTypes";

import { useGetLaunchpadSummary } from "@query/launchpad/use-get-launchpad-summary";
import LaunchpadMain from "@views/launchpad/components/launchpad-main/LaunchpadMain";

interface LaunchpadMainContainerProps {
  themeKey: ThemeKeys;
  icon: React.ReactNode;
}

const LaunchpadMainContainer: React.FC<LaunchpadMainContainerProps> = ({
  themeKey,
  icon,
}) => {
  const {
    data: launchpadSummary,
    isLoading: isLoadingSummary,
    isFetched: isFetchedSummary,
  } = useGetLaunchpadSummary();

  return (
    <LaunchpadMain
      data={launchpadSummary}
      isLoading={isLoadingSummary}
      isFetched={isFetchedSummary}
      themeKey={themeKey}
      icon={icon}
    />
  );
};

export default LaunchpadMainContainer;
