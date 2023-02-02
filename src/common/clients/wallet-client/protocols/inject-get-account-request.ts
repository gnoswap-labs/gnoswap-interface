import { InjectResponse } from "./inject-response";

export interface InjectGetAccountRequest {
	getAccount: () => Promise<InjectResponse<any>>;
}
