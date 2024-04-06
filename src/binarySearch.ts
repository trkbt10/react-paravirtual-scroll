export function heuristicBinarySearch(
	max: number,
	target: number,
	ratio: number,
	record: {
		[index: string]: number;
	},
) {
	if (max > 2147483647) {
		throw new Error("max must be less than 2147483647");
	}
	const start = ~~(max * ratio);

	if (record[start] === target) {
		return start;
	}
	let low = 0;
	let high = max;
	if (record[start] < target) {
		low = start + 1;
	} else {
		high = start;
	}
	while (low < high) {
		const mid = ~~((low + high) / 2);
		if (record[mid] <= target) {
			low = mid + 1;
		} else {
			high = mid;
		}
	}
	return low;
}
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
		if (record[mid] <= target) {
			low = mid + 1;
		} else {
			high = mid;
		}
	}
	return low;
}
