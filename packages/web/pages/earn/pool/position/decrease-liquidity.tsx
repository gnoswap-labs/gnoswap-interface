import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useMemo } from "react";

import SEOHeader from "@components/common/seo-header/seo-header";
import { DEFAULT_I18N_NS, SEOInfo } from "@constants/common.constant";
import useRouter from "@hooks/common/use-custom-router";
import PoolDecreaseLiquidity from "@views/pool/pool-decrease-liquidity/PoolDecreaseLiquidity";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        ...DEFAULT_I18N_NS,
        "DecreaseLiquidity",
      ])),
    },
  };
}

export default function Page() {
  const router = useRouter();
  const positionId = router.getPositionId();

  const seoInfo = useMemo(
    () => SEOInfo["/earn/pool/position/decrease-liquidity"],
    [],
  );

  return (
    <>
      <SEOHeader
        title={seoInfo.title([positionId as string])}
        pageDescription={seoInfo.desc()}
        ogTitle={seoInfo?.ogTitle?.()}
        ogDescription={seoInfo?.ogDesc?.()}
      />
      <PoolDecreaseLiquidity/>
    </>
  );
}
