const DEBOUNCE_TIME = 100;

export default function useOnScrollBottom(cb) {
  let maxTop = Infinity;
  let timmerId;

  function scrollCheck(container) {
    try {
      if (container.scrollTop <= maxTop) return;
      const {children} = container;
      const lastChild = children[children.length - 1];

      const containerRect = container.getBoundingClientRect();
      const lastChildRect = lastChild.getBoundingClientRect();

      if (lastChildRect.top <= containerRect.top + containerRect.height) {
        cb();
      }
    } finally {
      maxTop = Infinity;
      timmerId = undefined;
    }
  }

  return function onScroll(e) {
    if (timmerId !== undefined) clearTimeout(timmerId);
    maxTop = Math.min(e.target.scrollTop, maxTop);
    timmerId = setTimeout(scrollCheck, DEBOUNCE_TIME, e.target);
  };
}
