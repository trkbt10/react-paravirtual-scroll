export function binarySearch(
	max: number,
	target: number,
	record: {
		[index: string]: number;
	},
) {
	let low = 0;
	let high = max;
	while (low < high) {
		const mid = Math.floor((low + high) / 2);
		const midValue = record[mid];
		if (midValue <= target) {
			low = mid + 1;
		} else {
			high = mid;
		}
	}
	return low;
}
