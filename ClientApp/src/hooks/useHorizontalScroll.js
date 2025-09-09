// useHorizontalScroll.js
import { useEffect } from "react";

const useHorizontalScroll = (ref) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleWheel = (e) => {
      // The visible width and height of the element (excludes scrollbars and overflow)
      // The full width and height of the content inside the element (including overflow)
      const isHorizontallyScrollable = el.scrollWidth > el.clientWidth;
      const isVerticallyScrollable = el.scrollHeight > el.clientHeight;

      // Only hijack scroll if horizontal scroll is possible and vertical scroll isn't
      // deltaY is part of the wheel event: how much the user scrolled vertically
      // scrollLeft: represents the number of horizontal pixels that have been scrolled from the left edge of the element.
      if (
        isHorizontallyScrollable &&
        !isVerticallyScrollable &&
        e.deltaY !== 0
      ) {
        // stops the default vertical scroll behavior.
        e.preventDefault();
        // translates vertical scroll movement into horizontal scroll on the element.
        el.scrollLeft += e.deltaY;
      }

      // debugger

      // console.log({
      //   scrollHeight: el.scrollHeight,
      //   clientHeight: el.clientHeight,
      //   scrollWidth: el.scrollWidth,
      //   clientWidth: el.clientWidth,
      // });
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [ref]);
};

export default useHorizontalScroll;
