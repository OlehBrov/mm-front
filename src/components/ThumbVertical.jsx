export const ThumbVertical = (props, scroll) => {
  const position = {
    currentY: 0,
    startY: null,
    startScrollTop: null,
  };

  let isDragging = false;

  const handleTouchStart = (event) => {
    const container = scroll.current;

    position.startY = event.touches[0].clientY;
    position.startScrollTop = container.getScrollTop();

    isDragging = true;
  };

  const handleTouchMove = (event) => {
    if (!isDragging) return;

    const container = scroll.current;

    const currentY = event.touches[0].clientY;

    const deltaY = currentY - position.startY;

    const scrollRatio =
      container.getScrollHeight() / container.getClientHeight();

    const newScrollTop = position.startScrollTop + deltaY * scrollRatio;
    container.scrollTop(newScrollTop);
  };

  const handleTouchEnd = () => {
    isDragging = false;
  };

  return (
    <div
      {...props}
      className="thumb-vertical"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    />
  );
};
