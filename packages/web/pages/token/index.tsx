import { useMemo } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { TokenError } from "@common/errors/token";
import { DEFAULT_I18N_NS } from "@constants/common.constant";
import { WRAPPED_GNOT_PATH } from "@constants/environment.constant";
import useCustomRouter from "@hooks/common/use-custom-router";
import { useGnotToGnot } from "@hooks/token/data/use-gnot-wugnot";
import { useGetToken, useGetTokenPrices } from "@query/token";

import TokenDetail from "@layouts/token-detail/TokenDetail";
import { TokenSEOContainer } from "@containers/seo-header-container";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [...DEFAULT_I18N_NS, "Swap", "TokenDetails"])),
    },
  };
}

export default function Page() {
  const router = useCustomRouter();
  const path = router.getTokenPath();

  const { data: token } = useGetToken(path, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      if (err?.["response"]?.["status"] === 404) {
        router.push("/");
      }
      if (err instanceof TokenError) {
        router.push("/");
      }
    },
  });
  const { data: { usd: currentPrice } = {} } = useGetTokenPrices(
    path === "ugnot" ? WRAPPED_GNOT_PATH : (path as string),
    { enabled: !!path },
  );
  const { getGnotPath } = useGnotToGnot();

  const wrappedToken = useMemo(() => {
    if (!token) {
      return null;
    }
    return getGnotPath(token);
  }, [getGnotPath, token]);

  return (
    <>
      <TokenSEOContainer currentPrice={currentPrice} wrappedToken={wrappedToken} />
      <TokenDetail />
    </>
  );
}
