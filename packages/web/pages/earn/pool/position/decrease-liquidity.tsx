import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useMemo } from "react";

import { DEFAULT_I18N_NS, SEOInfo } from "@constants/common.constant";
import useRouter from "@hooks/common/use-custom-router";

import { EarnPoolDecreaseSEOContainer } from "@containers/seo-header-container";
import PoolDecreaseLiquidity from "@layouts/pool/pool-decrease-liquidity/PoolDecreaseLiquidity";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...DEFAULT_I18N_NS, "DecreaseLiquidity"])),
    },
  };
}

export default function Page() {
  const router = useRouter();
  const positionId = router.getPositionId();

  const seoInfo = useMemo(() => SEOInfo["/earn/pool/position/decrease-liquidity"], []);

  return (
    <>
      <EarnPoolDecreaseSEOContainer customTitle={seoInfo.title([positionId as string])} />
      <PoolDecreaseLiquidity />
    </>
  );
}
