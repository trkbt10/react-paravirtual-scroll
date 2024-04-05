import * as React from "react";

export const useMeasure = (ref: React.RefObject<HTMLElement>) => {
	const [bound, setBound] = React.useState<DOMRect | null>(null);
	React.useEffect(() => {
		const target = ref.current;
		if (!target) {
			return;
		}
		const measure = () => {
			const nextBound = target.getBoundingClientRect();
			setBound((prev) => {
				if (!prev) {
					return nextBound;
				}
				if (
					prev.width === nextBound.width &&
					prev.height === nextBound.height
				) {
					return prev;
				}
				return nextBound;
			});
		};
		const observer = new ResizeObserver(measure);
		observer.observe(target);
		measure();
		window.addEventListener("resize", measure);

		return () => {
			window.removeEventListener("resize", measure);
			observer.disconnect();
		};
	}, [ref]);
	return bound;
};
