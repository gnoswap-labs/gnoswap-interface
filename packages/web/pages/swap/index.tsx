import { useAtom } from "jotai";
import { useMemo } from "react";

import { DEFAULT_I18N_NS, SEOInfo } from "@constants/common.constant";
import * as SwapState from "@states/swap";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Swap from "@layouts/swap/Swap";
import { SwapSEOContainer } from "@containers/seo-header-container";
import { formatDisplayTokenSymbol } from "@utils/token-utils";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...DEFAULT_I18N_NS, "Swap", "Dashboard", "Pool"])),
    },
  };
}

export default function Page() {
  const [swapInfo] = useAtom(SwapState.swap);

  const seoInfo = useMemo(() => SEOInfo["/swap"], []);

  const title = useMemo(
    () =>
      seoInfo.title(
        [swapInfo.tokenA, swapInfo.tokenB].flatMap(token =>
          token ? [formatDisplayTokenSymbol(token.symbol, token.path)] : [],
        ),
      ),
    [seoInfo, swapInfo.tokenA, swapInfo.tokenB],
  );

  return (
    <>
      <SwapSEOContainer customTitle={title} />
      <Swap />
    </>
  );
}
