import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import useCustomRouter from "@hooks/common/use-custom-router";
import { DEFAULT_I18N_NS } from "@constants/common.constant";

import Earn from "@layouts/earn/Earn";
import { EarnSEOContainer } from "@containers/seo-header-container";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...DEFAULT_I18N_NS, "Earn", "SocialWallet"])),
    },
  };
}

export default function Page() {
  const router = useCustomRouter();
  const addr = router.getAddress();

  return (
    <>
      <EarnSEOContainer address={addr} />
      <Earn />
    </>
  );
}
