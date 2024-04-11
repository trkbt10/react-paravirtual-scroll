import * as React from "react";
import type { ParavirtualListProps } from "./types";
import { VariableSizeList } from "./List";
type Item = {
	id: number;
	name: string;
	height: number;
};
const variableHeightItems: Item[] = Array.from({ length: 1000 }, (_, index) => {
	return {
		id: index,
		name: `item-${index}`,
		height: 50 + 25 * Math.sin((index / 25) * (2 * Math.PI)),
	};
});
export function App(props: React.PropsWithChildren<{}>) {
	const totalHeight = React.useMemo(() => {
		return variableHeightItems.reduce((acc, item) => {
			return acc + item.height;
		}, 0);
	}, []);
	const itemSizeRecord = React.useMemo(() => {
		const result = {} as { [index: string]: number };
		for (const item of variableHeightItems) {
			result[item.id] = item.height;
		}
		return result;
	}, []);

	return (
		<VariableSizeList<Item[]>
			itemSizeRecord={itemSizeRecord}
			totalHeight={totalHeight}
			totalCount={variableHeightItems.length}
			data={variableHeightItems}
		>
			{renderItem}
		</VariableSizeList>
	);
}
const renderItem: ParavirtualListProps<Item[]>["children"] = (
	{ style, data },
	index,
) => {
	if (!data) {
		return null;
	}
	return (
		<div
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				height: style.height,
				width: "100%",
				transform: `translate3d(${style.left}px, ${style.top}px, 0)`,
				background: index % 2 === 0 ? "#f0f0f0" : "#fff",
			}}
		>
			{index}
			{data[index].name}
		</div>
	);
};
import { createRoot } from "react-dom/client";
const insert = document.getElementById("react-root");
if (!insert) {
	throw new Error("Couldn't find mount point");
}
const root = createRoot(insert);
root.render(<App />);
