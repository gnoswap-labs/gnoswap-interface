export interface ErrorResponse<T = any> {
	status: number;

	type: string;

	message: string;

	data: T | null;
}
