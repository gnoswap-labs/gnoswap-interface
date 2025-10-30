import React from "react";
import { useAtomValue } from "jotai";

import { useWindowSize } from "@hooks/common/use-window-size";
import { ThemeState } from "@states/index";
import { useGetLaunchpadSummary } from "@query/launchpad/use-get-launchpad-summary";
import { nullLaunchpadSummaryInfo } from "@repositories/launchpad/model";

import LaunchpadMain from "@layouts/launchpad/components/launchpad-main/LaunchpadMain";

interface LaunchpadMainContainerProps {
  onOpenVideoGuide: (type: "LAUNCHPAD") => void;
}

const LaunchpadMainContainer: React.FC<LaunchpadMainContainerProps> = ({ onOpenVideoGuide }) => {
  const themeKey = useAtomValue(ThemeState.themeKey);
  const { data: launchpadSummary, isLoading: isLoadingSummary, isFetched: isFetchedSummary } = useGetLaunchpadSummary();

  const { breakpoint } = useWindowSize();

  return (
    <LaunchpadMain
      data={launchpadSummary ?? nullLaunchpadSummaryInfo}
      isLoading={isLoadingSummary}
      isFetched={isFetchedSummary}
      breakpoint={breakpoint}
      themeKey={themeKey}
      onOpenVideoGuide={onOpenVideoGuide}
    />
  );
};

export default LaunchpadMainContainer;
