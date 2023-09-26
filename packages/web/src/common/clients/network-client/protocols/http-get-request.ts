import { HttpResponse } from "./http-response";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface HttpGetRequestParam {
  url: string;
  auth?: boolean;
}

export interface HttpGetRequest {
  get: <R>(params: HttpGetRequestParam) => Promise<HttpResponse<R>>;
}
