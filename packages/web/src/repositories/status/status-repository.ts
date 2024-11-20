import { SyncInfoResponse } from "./response";

export interface StatusRepository {
  getSyncInfo: () => Promise<SyncInfoResponse>;
}
