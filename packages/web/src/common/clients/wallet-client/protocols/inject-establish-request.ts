import { InjectResponse } from "./inject-response";

export interface InjectEstablishRequest {
  addEstablishedSite: (sitename: string) => Promise<InjectResponse<any>>;
}
