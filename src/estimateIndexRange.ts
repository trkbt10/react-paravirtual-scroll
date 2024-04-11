import { heuristicBinarySearch } from "./binarySearch";

type EstimateIndexRangeParams = {
	totalCount: number;
	scrollValue: number;
	bound: Pick<DOMRectReadOnly, "height" | "width">;
	overscanCount?: number;
	itemScrollYMap: {
		[index: string]: number;
	};
};
export function getStartPositionStatus({
	scrollValue,
	totalCount,
	itemScrollYMap,
}: Pick<
	EstimateIndexRangeParams,
	"scrollValue" | "totalCount" | "itemScrollYMap"
>) {
	const heuristicRatio = scrollValue / itemScrollYMap[totalCount - 1];
	const visibleStartIndex = Math.max(
		0,
		heuristicBinarySearch(
			totalCount,
			scrollValue,
			heuristicRatio,
			itemScrollYMap,
		) - 1,
	);
	const visibleStart = itemScrollYMap[visibleStartIndex];
	return {
		visibleStartIndex: visibleStartIndex,
		visibleStart,
	};
}

export function getEndPositionStatus({
	bound,
	scrollValue,
	totalCount,
	visibleStart,
	itemScrollYMap,
}: Pick<
	EstimateIndexRangeParams,
	"itemScrollYMap" | "scrollValue" | "bound" | "totalCount"
> & {
	visibleStart: number;
}) {
	const gap = scrollValue - visibleStart;
	const displayHeight = bound.height + gap;
	const heuristicRatio = displayHeight / bound.height;
	const visibleEndIndex = heuristicBinarySearch(
		totalCount,
		visibleStart + displayHeight,
		heuristicRatio,
		itemScrollYMap,
	);
	const visibleHeight = itemScrollYMap[visibleEndIndex] - visibleStart;
	return { visibleEndIndex, visibleHeight };
}
export function estimateIndexRange({
	totalCount,
	scrollValue,
	overscanCount = 2,
	bound,
	itemScrollYMap,
}: EstimateIndexRangeParams) {
	const { visibleStartIndex, visibleStart } = getStartPositionStatus({
		scrollValue,
		totalCount,
		itemScrollYMap,
	});
	const { visibleEndIndex } = getEndPositionStatus({
		scrollValue,
		totalCount,
		itemScrollYMap,
		visibleStart: visibleStart,
		bound,
	});

	// Overscan
	const overscanStartIndex = Math.max(0, visibleStartIndex - overscanCount);
	const overscanTranslate = itemScrollYMap[overscanStartIndex] - visibleStart;

	const overscanEndIndex = Math.min(
		totalCount,
		visibleEndIndex + overscanCount,
	);
	// Calculate the number of items to render
	const renderItemCount = overscanEndIndex - overscanStartIndex;

	return {
		visibleStartIndex,
		visibleEndIndex,
		visibleStartY: visibleStart,
		renderItemCount: renderItemCount,
		overscanTranslateY: overscanTranslate,
		overscanStartIndex,
		overscanEndIndex,
	};
}
