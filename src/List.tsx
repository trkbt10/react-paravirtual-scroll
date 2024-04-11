import * as React from "react";
import { useMeasure } from "./useMeasure";
import { estimateIndexRange } from "./estimateIndexRange";
import { useScrollValue } from "./useScrollValue";
import type { FixedSizeListProps, VariableSizeListProps } from "./types";
const measurementElementStyle: React.CSSProperties = {
	position: "fixed",
	top: 0,
	left: 0,
	height: "100%",
	width: "100%",
	minHeight: "100svh",
	maxHeight: "100lvh",
	overflow: "hidden",
	display: "content",
	pointerEvents: "none",
	zIndex: -1,
};
export const FixedSizeList: <T>(
	props: FixedSizeListProps<T>,
) => React.ReactNode = (props) => {
	const itemSizeRecord = React.useMemo(() => {
		return new Proxy({} as { [index: string]: number }, {
			get: (target, p, receiver) => {
				if (typeof p !== "string") {
					return Reflect.get(target, p, receiver);
				}
				const index = parseInt(p, 10);
				if (index < 0) {
					return 0;
				}
				return props.itemSize;
			},
		});
	}, [props.itemSize]);
	const totalHeight = React.useMemo(() => {
		return props.totalCount * props.itemSize;
	}, [props.totalCount, props.itemSize]);
	return (
		<VariableSizeList
			{...props}
			totalHeight={totalHeight}
			itemSizeRecord={itemSizeRecord}
		/>
	);
};
const key = "__scroll_top";
export const VariableSizeList: <T>(
	props: VariableSizeListProps<T>,
) => React.ReactNode = ({
	itemSizeRecord,
	children,
	initialScrollOffset,
	totalCount,
	totalHeight,
	overscanCount,
	direction,
	scrollContainer,
	data,
	onItemsRendered,
	scrollRestoration,
}) => {
	const { scrollValueX, scrollValueY, scrolling } =
		useScrollValue(scrollContainer);
	const scrollValue =
		direction === "ltr" || direction === "rtl" ? scrollValueX : scrollValueY;
	const ref = React.useRef<HTMLDivElement>(null);
	const [scrollPositionRestored, setScrollPositionRestored] =
		React.useState(false);
	React.useEffect(() => {
		if (scrollRestoration !== "manual") {
			return;
		}
		const lastScrollPosition = sessionStorage.getItem(key);
		window.scrollTo(0, lastScrollPosition ? parseInt(lastScrollPosition) : 0);
		setScrollPositionRestored(true);
	}, [scrollRestoration]);
	React.useEffect(() => {
		if (typeof window === "undefined") {
			return;
		}
		if (!scrollPositionRestored) {
			return;
		}
		if (scrollRestoration !== "manual") {
			return;
		}
		if (scrolling) {
			return;
		}
		sessionStorage.setItem(key, scrollValue.toString());
	}, [scrollPositionRestored, scrollValue, scrollRestoration, scrolling]);
	React.useEffect(() => {
		if (typeof window === "undefined") {
			return;
		}
		if (typeof initialScrollOffset === "undefined") {
			return;
		}
		const element = scrollContainer?.current || window;
		element.scrollTo(0, initialScrollOffset);
	}, [scrollContainer, initialScrollOffset]);
	const bound = useMeasure(ref);
	const [renderItems, setRenderItems] = React.useState<
		{
			x: number;
			y: number;
			size: number;
			index: number;
		}[]
	>([]);
	const itemScrollYMap = React.useMemo(() => {
		const result = {} as { [index: string]: number };
		for (let index = 0; index < totalCount; index++) {
			const prevItemSize = itemSizeRecord[index - 1] || 0;
			result[index] = (result[index - 1] ?? 0) + prevItemSize;
		}
		return result;
	}, [totalCount, itemSizeRecord]);
	const [renderedItems, setRenderedItems] = React.useState<{
		overscanStartIndex: number;
		overscanEndIndex: number;
		visibleStartIndex: number;
		visibleEndIndex: number;
	}>();

	React.useEffect(() => {
		if (!bound) {
			return;
		}
		const indexRange = estimateIndexRange({
			totalCount,
			itemScrollYMap,
			scrollValue,
			bound,
			overscanCount: overscanCount ?? 0,
		});
		const {
			overscanStartIndex,
			overscanTranslateY,
			visibleStartIndex,
			visibleEndIndex,
			overscanEndIndex,
			renderItemCount,
			visibleStartY,
		} = indexRange;
		const targets = Array.from({ length: renderItemCount }, (_, index) => {
			return {
				index: overscanStartIndex + index,
			};
		});
		const targetPositions: { x: number; y: number; size: number }[] = [];
		targets.reduce(
			(prev, item) => {
				const size = itemSizeRecord[item.index];

				const current = {
					x: prev.x,
					y: prev.y + prev.size,
					size: size,
				};
				targetPositions.push(current);
				return current;
			},
			{
				x: 0,
				y: 0,
				size: 0,
			},
		);
		const displayItems = targets.map((item, index) => {
			const position = targetPositions[index];
			return {
				x: position.x,
				y: position.y + visibleStartY + overscanTranslateY,
				size: position.size,
				index: item.index,
			};
		});
		setRenderedItems({
			overscanStartIndex,
			overscanEndIndex,
			visibleStartIndex,
			visibleEndIndex,
		});
		setRenderItems(displayItems);
	}, [
		scrollValue,
		totalCount,
		itemSizeRecord,
		overscanCount,
		bound,
		itemScrollYMap,
	]);
	React.useEffect(() => {
		if (!onItemsRendered || !renderedItems) {
			return;
		}
		onItemsRendered(renderedItems);
	}, [renderedItems, onItemsRendered]);
	return (
		<>
			{/* Scroll height reserve element */}
			<div
				style={{
					width: "100%",
					height: totalHeight,
					pointerEvents: "none",
					display: "content",
				}}
				aria-hidden="true"
				role="presentation"
			></div>
			<div
				ref={ref}
				style={measurementElementStyle}
				aria-hidden="true"
				role="presentation"
			></div>
			{renderItems.map((item) => {
				return (
					<React.Fragment key={item.index}>
						{children(
							{
								style: {
									position: "absolute",
									top: item.y,
									left: item.x,
									width: "100%",
									height: item.size,
								},
								data,
							},
							item.index,
						)}
					</React.Fragment>
				);
			})}
		</>
	);
};
