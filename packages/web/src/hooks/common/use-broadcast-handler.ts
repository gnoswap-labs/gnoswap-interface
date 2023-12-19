import { INoticeContent } from "@components/common/notice/NoticeToast";
import { makeRandomId } from "@utils/common";
import { useCallback, useContext } from "react";
import {
  INoticeOptions,
  NoticeContext,
  TNoticeType,
} from "src/context/NoticeContext";

function makeNoticeConfig(type: TNoticeType): INoticeOptions {
  const timeout = 50000;
  return {
    id: makeRandomId(),
    type,
    closeable: true,
    timeout,
  };
}

export const useBroadcastHandler = () => {
  const { setNotice, onCloseNotice } = useContext(NoticeContext);

  const broadcastSuccess = useCallback(
    (content?: INoticeContent) => {
      setNotice(content, makeNoticeConfig("success"));
    },
    [setNotice],
  );

  const broadcastPending = useCallback(
    (content?: INoticeContent) => {
      setNotice(content, makeNoticeConfig("pending"));
    },
    [setNotice],
  );

  const broadcastError = useCallback(
    (content?: INoticeContent) => {
      setNotice(content, makeNoticeConfig("error"));
    },
    [setNotice],
  );

  const clearBroadcast = useCallback(() => {
    onCloseNotice();
  }, [onCloseNotice]);

  return {
    broadcastSuccess,
    broadcastPending,
    broadcastError,
    clearBroadcast,
  };
};
