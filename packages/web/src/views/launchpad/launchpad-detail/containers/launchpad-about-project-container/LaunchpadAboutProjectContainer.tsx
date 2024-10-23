import React from "react";

import LaunchpadAboutProject from "../../components/launchpad-about-project/LaunchpadAboutProject";
import { useLoading } from "@hooks/common/use-loading";
import { ProjectDescriptionDataModel } from "../../LaunchpadDetail";

interface LaunchpadAboutProjectContainerProps {
  data: ProjectDescriptionDataModel;
}

const TEXT_TRUNCATION_THRESHOLD = 260;

const LaunchpadAboutProjectContainer: React.FC<
  LaunchpadAboutProjectContainerProps
> = ({ data }) => {
  const { isLoading: isLoadingCommon } = useLoading();

  const [isShowMore, setIsShowMore] = React.useState(false);

  const showDescription = React.useMemo(() => {
    if (!data.description) return "";

    if (!isShowMore && data.description.length > TEXT_TRUNCATION_THRESHOLD) {
      return data.description.slice(0, TEXT_TRUNCATION_THRESHOLD) + "...";
    }

    return data.description;
  }, [data?.description, isShowMore]);

  const handleClickShowMore = React.useCallback(() => {
    setIsShowMore(prev => !prev);
  }, []);

  return (
    <LaunchpadAboutProject
      loading={isLoadingCommon}
      data={{ ...data, description: showDescription }}
      isShowMore={isShowMore}
      showLoadMore={data?.description.length > TEXT_TRUNCATION_THRESHOLD}
      onClickLoadMore={handleClickShowMore}
    />
  );
};

export default LaunchpadAboutProjectContainer;
