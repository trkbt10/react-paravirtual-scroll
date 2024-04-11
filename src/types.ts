import type * as React from "react";
export type RenderItem<T> = (
	props: {
		data: T;
		style: React.CSSProperties;
	},
	index: number,
) => React.ReactNode;

export type ItemsRenderedParams = {
	overscanStartIndex: number;
	overscanEndIndex: number;
	visibleStartIndex: number;
	visibleEndIndex: number;
};
export type ParavirtualListProps<T> = {
	totalCount: number;
	direction?: "ltr" | "rtl" | "ttb" | "btt";
	children: RenderItem<T>;
	onItemsRendered?: (params: ItemsRenderedParams) => void;
	initialScrollOffset?: number;
	data: T;
	scrollRestoration?: "auto" | "manual";
	overscanCount?: number;
	scrollContainer?: React.RefObject<HTMLElement>;
};
export type VariableSizeListProps<T> = ParavirtualListProps<T> & {
	itemSizeRecord: {
		[index: string]: number;
	};
	totalHeight: number;
};
export type FixedSizeListProps<T> = ParavirtualListProps<T> & {
	itemSize: number;
};
