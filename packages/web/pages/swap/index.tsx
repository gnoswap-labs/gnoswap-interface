import { useAtom } from "jotai";
import { useMemo } from "react";

import { DEFAULT_I18N_NS, SEOInfo } from "@constants/common.constant";
import * as SwapState from "@states/swap";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Swap from "@layouts/swap/Swap";
import { SwapSEOContainer } from "@containers/seo-header-container";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...DEFAULT_I18N_NS, "Swap"])),
    },
  };
}

export default function Page() {
  const [swapInfo] = useAtom(SwapState.swap);

  const seoInfo = useMemo(() => SEOInfo["/swap"], []);

  const title = useMemo(
    () => seoInfo.title([swapInfo.tokenA?.symbol, swapInfo.tokenB?.symbol].filter(item => item) as string[]),
    [seoInfo, swapInfo.tokenA?.symbol, swapInfo.tokenB?.symbol],
  );

  return (
    <>
      <SwapSEOContainer customTitle={title} />
      <Swap />
    </>
  );
}
