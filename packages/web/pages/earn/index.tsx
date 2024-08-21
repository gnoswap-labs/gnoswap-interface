import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useMemo } from "react";

import SEOHeader from "@components/common/seo-header/seo-header";
import { DEFAULT_I18N_NS, SEOInfo } from "@constants/common.constant";
import useCustomRouter from "@hooks/common/use-custom-router";
import { formatAddress } from "@utils/string-utils";
import Earn from "@views/earn/Earn";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...DEFAULT_I18N_NS, "Earn"])),
    },
  };
}

export default function Page() {
  const router = useCustomRouter();
  const addr = router.getAddress();

  const seoInfo = useMemo(
    () => SEOInfo[addr ? "/earn?address" : "/earn"],
    [addr],
  );

  return (
    <>
      <SEOHeader
        title={seoInfo.title(
          [addr ? formatAddress(addr) : undefined].filter(
            item => item,
          ) as string[],
        )}
        pageDescription={seoInfo.desc()}
        ogTitle={seoInfo?.ogTitle?.()}
        ogDescription={seoInfo?.ogDesc?.()}
      />
      <Earn />
    </>
  );
}
