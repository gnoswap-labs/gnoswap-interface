import { useGetTokenByPath } from "@query/token";
const WRAPPED_GNOT_PATH = process.env.NEXT_PUBLIC_WRAPPED_GNOT_PATH || "";
const GNOT_PATH = "gnot";

export const useGnotToGnot = () => {
  const { data: gnot } = useGetTokenByPath(GNOT_PATH);
  const { data: wugnot } = useGetTokenByPath(WRAPPED_GNOT_PATH);
  return {
    gnot,
    wugnot,
    wugnotPath: WRAPPED_GNOT_PATH,
  };
};