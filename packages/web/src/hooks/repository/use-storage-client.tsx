import { StorageClient, WebStorageClient } from "@common/clients/storage-client";
import { StorageKeyType } from "@common/values";
import { RepositoryState } from "@states/index";
import { useAtom } from "jotai";

export const useStorageClient = (): StorageClient<StorageKeyType> => {
  const [localStorage, setLocalStorage] = useAtom(RepositoryState.localStorageClient);

  function getLocalStorage() {
    if (!localStorage) {
      const createdLocalStorage = WebStorageClient.createLocalStorageClient();
      setLocalStorage(createdLocalStorage);
      return createdLocalStorage;
    }
    return localStorage;
  }

  return getLocalStorage();
};
