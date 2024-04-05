import * as React from "react";

export function useScrollValue(ref?: React.RefObject<HTMLElement>) {
	const [pending, startTransition] = React.useTransition();
	const [scrollValueX, setScrollValueX] = React.useState(() => {
		if (typeof window === "undefined") {
			return 0;
		}
		if (ref && ref.current) {
			return ref.current.scrollLeft;
		}
		return window.scrollX;
	});
	const [scrollValueY, setScrollValueY] = React.useState(() => {
		if (typeof window === "undefined") {
			return 0;
		}
		if (ref && ref.current) {
			return ref.current.scrollTop;
		}
		return window.scrollY;
	});
	React.useEffect(() => {
		const target = ref?.current || window;
		if (typeof target === "undefined") {
			return;
		}

		// Update the scroll value when the scroll event is fired
		const handleScroll = () => {
			startTransition(() => {
				if (ref && ref.current) {
					setScrollValueX(ref.current.scrollLeft);
					setScrollValueY(ref.current.scrollTop);
				} else {
					setScrollValueX(window.scrollX);
					setScrollValueY(window.scrollY);
				}
			});
		};
		target.addEventListener("scroll", handleScroll);
		return () => {
			target.removeEventListener("scroll", handleScroll);
		};
	}, [ref]);
	return { scrollValueX, scrollValueY };
}
