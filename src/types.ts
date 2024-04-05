import type * as React from "react";
export type ParavirtualListProps<T> = {
	totalCount: number;
	totalHeight: number;
	direction?: "ltr" | "rtl" | "ttb" | "btt";
	children: (
		props: {
			data: T;
			items: T[];
			style: React.CSSProperties;
		},
		index: number,
	) => React.ReactNode;
	initialScrollOffset?: number;
	items: T[];
	overscanCount?: number;
	itemSizeRecord: {
		[index: string]: number;
	};
	scrollContainer?: React.RefObject<HTMLElement>;
};
