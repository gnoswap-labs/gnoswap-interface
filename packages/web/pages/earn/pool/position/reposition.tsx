import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useMemo } from "react";

import { DEFAULT_I18N_NS, SEOInfo } from "@constants/common.constant";
import useRouter from "@hooks/common/use-custom-router";

import { EarnPoolRepositionSEOContainer } from "@containers/seo-header-container";
import PoolReposition from "@layouts/pool/pool-reposition/PoolReposition";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...DEFAULT_I18N_NS, "Reposition", "AddPosition"])),
    },
  };
}

export default function Page() {
  const router = useRouter();
  const positionId = router.getPositionId();

  const seoInfo = useMemo(() => SEOInfo["/earn/pool/position/reposition"], []);

  return (
    <>
      <EarnPoolRepositionSEOContainer customTitle={seoInfo.title([positionId as string])} />
      <PoolReposition />
    </>
  );
}
