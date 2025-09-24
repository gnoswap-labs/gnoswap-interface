import React from "react";

import { VideoGuideType } from "@constants/video-guide.constant";
import { QUERY_PARAMETER } from "@constants/page.constant";
import { isValidVideoGuideType } from "@utils/video-guide.utils";

export const useVideoGuide = (targetType: VideoGuideType) => {
  const [currentGuide, setCurrentGuide] = React.useState<string | null>(null);
  const isOpen = currentGuide === targetType;

  const openVideoGuide = React.useCallback((type: VideoGuideType) => {
    setCurrentGuide(type);
  }, []);

  const closeVideoGuide = React.useCallback((value: boolean) => {
    if (!value) {
      setCurrentGuide(null);
    }
  }, []);

  const updateCurrentGuide = React.useCallback((guide: string | null) => {
    if (guide && !isValidVideoGuideType(guide)) {
      console.warn(`Invalid video guide type: ${guide}`);
      setCurrentGuide(null);
    } else {
      setCurrentGuide(guide);
    }
  }, []);

  /**
   * @role
   * When the page first loads,
   * read parameters like `?guide=POSITION`
   * from the URL to automatically open the modal.
   */
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const guide = params.get(QUERY_PARAMETER.GUIDE);
      updateCurrentGuide(guide);
    }
  }, [updateCurrentGuide]);

  return {
    currentGuide,
    isOpen,
    openVideoGuide,
    closeVideoGuide,
  };
};
