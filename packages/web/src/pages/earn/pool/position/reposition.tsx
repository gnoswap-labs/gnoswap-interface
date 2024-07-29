import Footer from "@components/common/footer/Footer";
import BreadcrumbsContainer from "@containers/breadcrumbs-container/BreadcrumbsContainer";
import HeaderContainer from "@containers/header-container/HeaderContainer";
import RepositionContainer from "@containers/reposition-container/RepositionContainer";
import { useLoading } from "@hooks/common/use-loading";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import RepositionLayout from "@layouts/reposition/RepositionLayout";
import { DeviceSize } from "@styles/media";
import useRouter from "@hooks/common/use-custom-router";
import { useMemo } from "react";
import { useGetPoolDetailByPath } from "src/react-query/pools";
import SEOHeader from "@components/common/seo-header/seo-header";
import { DEFAULT_I18N_NS, SEOInfo } from "@constants/common.constant";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { makeRouteUrl } from "@utils/page.utils";
import { PAGE_PATH, QUERY_PARAMETER } from "@constants/page.constant";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...DEFAULT_I18N_NS])),
    },
  };
}

export default function Reposition() {
  const { width } = useWindowSize();
  const router = useRouter();
  const poolPath = router.getPoolPath();
  const positionId = router.getPositionId();
  const { data, isLoading } = useGetPoolDetailByPath(poolPath as string);
  const { getGnotPath } = useGnotToGnot();
  const { isLoading: isLoadingCommon } = useLoading();

  const listBreadcrumb = useMemo(() => {
    return [
      { title: "Earn", path: "/earn" },
      {
        title:
          width > DeviceSize.mediumWeb
            ? `${getGnotPath(data?.tokenA).symbol}/${
                getGnotPath(data?.tokenB).symbol
              } (${Number(data?.fee) / 10000}%)`
            : "...",
        path: makeRouteUrl(PAGE_PATH.POOL, {
          [QUERY_PARAMETER.POOL_PATH]: poolPath,
        }),
      },
      { title: "Reposition", path: "" },
    ];
  }, [data, width]);

  const seoInfo = useMemo(() => SEOInfo["/earn/pool/position/reposition"], []);

  return (
    <>
      <SEOHeader
        title={seoInfo.title([positionId as string])}
        pageDescription={seoInfo.desc()}
        ogTitle={seoInfo?.ogTitle?.()}
        ogDescription={seoInfo?.ogDesc?.()}
      />
      <RepositionLayout
        header={<HeaderContainer />}
        breadcrumbs={
          <BreadcrumbsContainer
            listBreadcrumb={listBreadcrumb}
            isLoading={isLoadingCommon || isLoading}
          />
        }
        reposition={<RepositionContainer />}
        footer={<Footer />}
      />
    </>
  );
}
