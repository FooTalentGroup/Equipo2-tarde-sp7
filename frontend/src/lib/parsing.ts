export function parseAmount(
	value: string | number | null | undefined,
): number | undefined {
	if (value === null || value === undefined) return undefined;
	if (typeof value === "number") return value;

	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : undefined;
}
