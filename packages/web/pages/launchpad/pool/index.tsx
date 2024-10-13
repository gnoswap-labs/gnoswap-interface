import React from "react";

import { SEOInfo } from "@constants/common.constant";
import SEOHeader from "@components/common/seo-header/seo-header";
import LaunchpadDetail from "@views/launchpad/launchpad-detail/LaunchpadDetail";

export default function Page() {
  const seoInfo = React.useMemo(() => SEOInfo["/launchpad"], []);

  return (
    <>
      <SEOHeader
        title={seoInfo.title()}
        pageDescription={seoInfo.desc()}
        ogTitle={seoInfo.ogTitle?.()}
        ogDescription={seoInfo.ogDesc?.()}
      />
      <LaunchpadDetail />
    </>
  );
}
