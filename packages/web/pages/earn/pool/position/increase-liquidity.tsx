import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useMemo } from "react";

import { DEFAULT_I18N_NS, SEOInfo } from "@constants/common.constant";
import useRouter from "@hooks/common/use-custom-router";

import { EarnPoolIncreaseSEOContainer } from "@containers/seo-header-container";
import PoolIncreaseLiquidity from "@layouts/pool/pool-increase-liquidity/PoolIncreaseLiquidity";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...DEFAULT_I18N_NS, "IncreaseLiquidity"])),
    },
  };
}

export default function Page() {
  const router = useRouter();
  const positionId = router.getPositionId();

  const seoInfo = useMemo(() => SEOInfo["/earn/pool/position/increase-liquidity"], []);

  return (
    <>
      <EarnPoolIncreaseSEOContainer customTitle={seoInfo.title([positionId as string])} />
      <PoolIncreaseLiquidity />
    </>
  );
}
