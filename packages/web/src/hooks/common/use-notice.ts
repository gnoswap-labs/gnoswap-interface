import { useContext } from "react";
import { NoticeContext } from "src/context/NoticeContext";

export const useNotice = () => {
  return useContext(NoticeContext);
};
