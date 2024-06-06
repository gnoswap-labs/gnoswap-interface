import { HttpResponse } from "./http-response";

export interface HttpGetRequestParam {
  url: string;
  auth?: boolean;
}

export interface HttpGetRequest {
  get: <R>(params: HttpGetRequestParam) => Promise<HttpResponse<R>>;
}
