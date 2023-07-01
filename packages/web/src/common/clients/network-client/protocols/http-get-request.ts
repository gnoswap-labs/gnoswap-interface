import { HttpResponse } from "./http-response";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface HttpGetRequestParam<T> {
  url: string;
  auth?: boolean;
}

export interface HttpGetRequest {
  get: <T, R>(params: HttpGetRequestParam<T>) => Promise<HttpResponse<R>>;
}
