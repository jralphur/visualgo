export const capitalizeFirst = (s: string): string => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const getCoords = (e: Element | null) => {
  const box = e?.getBoundingClientRect() || {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  }

  return {
    top: box.top + window.pageYOffset,
    right: box.right + window.pageXOffset,
    bottom: box.bottom + window.pageYOffset,
    left: box.left + window.pageXOffset
  };
}