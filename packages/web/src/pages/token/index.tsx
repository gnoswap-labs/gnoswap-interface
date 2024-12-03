import { useMemo } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { TokenError } from "@common/errors/token";
import SEOHeader from "@components/common/seo-header/seo-header";
import { DEFAULT_I18N_NS, SEOInfo } from "@constants/common.constant";
import { WRAPPED_GNOT_PATH } from "@constants/environment.constant";
import useCustomRouter from "@hooks/common/use-custom-router";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import TokenDetail from "@views/token-detail/TokenDetail";
import { useGetToken, useGetTokenPrices } from "@query/token";
import { formatPrice } from "@utils/new-number-utils";

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        ...DEFAULT_I18N_NS,
        "Swap",
        "TokenDetails",
      ])),
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
    path === "gnot" ? WRAPPED_GNOT_PATH : (path as string),
    { enabled: !!path },
  );
  const { getGnotPath } = useGnotToGnot();

  const wrappedToken = useMemo(() => {
    if (!token) {
      return null;
    }
    return getGnotPath(token);
  }, [getGnotPath, token]);

  const seoInfo = useMemo(() => SEOInfo["/token"], []);

  const title = useMemo(() => {
    return seoInfo.title([
      currentPrice ? formatPrice(currentPrice) : undefined,
      token ? wrappedToken?.name : undefined,
      token ? wrappedToken?.symbol : undefined,
    ]);
  }, [currentPrice, seoInfo, token, wrappedToken?.name, wrappedToken?.symbol]);

  const ogTitle = useMemo(
    () =>
      seoInfo.ogTitle?.(
        [
          token ? wrappedToken?.name : undefined,
          token ? wrappedToken?.symbol : undefined,
        ].filter(item => item),
      ),
    [seoInfo, token, wrappedToken?.name, wrappedToken?.symbol],
  );
  const desc = useMemo(
    () =>
      seoInfo.desc?.(
        [token ? wrappedToken?.symbol : undefined].filter(item => item),
      ),
    [seoInfo, token, wrappedToken?.symbol],
  );

  return (
    <>
      <SEOHeader
        title={title}
        ogTitle={ogTitle}
        pageDescription={desc}
        ogDescription={seoInfo.ogDesc?.()}
      />
      <TokenDetail />
    </>
  );
}
