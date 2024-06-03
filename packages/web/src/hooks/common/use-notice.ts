import { useContext } from "react";
import { NoticeContext } from "@context/NoticeContext";

export const useNotice = () => {
  return useContext(NoticeContext);
};
