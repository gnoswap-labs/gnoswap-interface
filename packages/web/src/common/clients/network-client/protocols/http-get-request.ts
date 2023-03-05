import { HttpResponse } from "./http-response";

export interface HttpGetRequestParam<T> {
	url: string;
	auth?: boolean;
}

export interface HttpGetRequest {
	get: <T, R>(params: HttpGetRequestParam<T>) => Promise<HttpResponse<R>>;
}
