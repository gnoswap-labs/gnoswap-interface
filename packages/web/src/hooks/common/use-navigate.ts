import { Url } from "url";
import { useRouter } from "next/router";
import { useMemo } from "react";

const useNavigate = () => {
  const router = useRouter();

  return useMemo(() => {
    return {
      toMain: () => {
        router.push("/");
      },
      back: () => {
        router.back();
      },
      push: (pathname: string, as?: Url, options?: any) => {
        router.push(pathname, as, options);
      },
      replace: (pathname: string, as?: Url, options?: any) => {
        router.replace(pathname, as, options);
      },
    };
  }, [router]);
};

export default useNavigate;
