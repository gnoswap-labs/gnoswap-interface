import { useMemo } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useAtomValue } from "jotai";

import { ThemeState } from "@states/index";
import { DEFAULT_I18N_NS, SEOInfo } from "@constants/common.constant";
import SEOHeader from "@components/common/seo-header/seo-header";

import LaunchpadLayout from "@layouts/launchpad/LaunchpadLayout";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import LaunchpadMainContainer from "@layouts/launchpad/containers/launchpad-main-container/LaunchpadMainContainer";
import IconLaunchpadMain from "@components/common/icons/IconLaunchpadMain";
import LaunchpadActiveProjectContainer from "@layouts/launchpad/containers/launchpad-active-project-container/LaunchpadActiveProjectContainer";
import LaunchpadProjectListContainer from "@layouts/launchpad/containers/launchpad-project-list-container/LaunchpadProjectListContainer";
import Footer from "@components/common/footer/Footer";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...DEFAULT_I18N_NS, "Launchpad", "Earn"])),
    },
  };
}

export default function Page() {
  const themeKey = useAtomValue(ThemeState.themeKey);

  /**
   * SEO
   * Todo: SEO will be managed by a new container
   */
  const seoInfo = useMemo(() => SEOInfo["/launchpad"], []);

  return (
    <>
      <SEOHeader
        title={seoInfo.title()}
        pageDescription={seoInfo.desc()}
        ogTitle={seoInfo.ogTitle?.()}
        ogDescription={seoInfo.ogDesc?.()}
      />
      <LaunchpadLayout
        header={<HeaderContainer />}
        main={
          <LaunchpadMainContainer
            themeKey={themeKey}
            icon={<IconLaunchpadMain themeKey={themeKey} className="icon-launchpad" />}
          />
        }
        activeProjects={<LaunchpadActiveProjectContainer />}
        projectList={<LaunchpadProjectListContainer />}
        footer={<Footer />}
      />
    </>
  );
}
