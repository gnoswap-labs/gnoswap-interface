import { HttpResponse } from "./http-response";

export interface HttpPostRequestParam<T> {
  url: string;
  body?: T;
  auth?: boolean;
}

export interface HttpPostRequest {
  post: <T, R>(params: HttpPostRequestParam<T>) => Promise<HttpResponse<R>>;
}
