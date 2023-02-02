export interface InjectResponse<T> {
	code: number;
	status: string;
	type: string;
	message: string;
	data: T;
}
