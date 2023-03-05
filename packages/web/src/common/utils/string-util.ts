export function formatAddress(value: string, num?: number): string {
	const length = num ?? 5;
	return value.length < 10
		? value
		: `${value.slice(0, length)}...${value.slice(-length)}`;
}
