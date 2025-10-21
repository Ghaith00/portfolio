export function formatDate(value?: string) {
	if (!value) return "Undated";
	return new Intl.DateTimeFormat("en", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(new Date(value));
}

export function formatNumber(value?: number | null) {
	if (!value) return "0";
	if (value > 999) {
		const compact = (value / 1000).toFixed(1);
		return `${parseFloat(compact)}k`;
	}
	return `${value}`;
}
