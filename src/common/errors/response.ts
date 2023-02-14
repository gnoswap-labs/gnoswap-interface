export interface ErrorResponse<T = any> {
	isError: boolean;

	status: number;

	type: string;

	message: string;

	data: T | null;
}
