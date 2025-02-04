import { useRef, useState } from "react";

export const ThumbVertical = (props, scroll) => {
  console.log("ThumbVertical scroll", scroll.current);
  let startY = null;
  let stopY = null;
  let startScrollTop = null;
  let isDragging = false;

  const handleTouchStart = (event) => {
    const thumb = event.currentTarget;
    const container = scroll.current;
    if (!startY) startY = event.touches[0].clientY;
    if (startY) startY = stopY;
    console.log("event.touches[0].clientY", event.touches[0].clientY);
    startScrollTop = container.scrollTop;
    isDragging = true;
  };

  const handleTouchMove = (event) => {
    if (!isDragging) return;

    const thumb = event.currentTarget;
    const container = scroll.current;

    const currentY = event.touches[0].clientY;

    const deltaY = currentY - startY;
    console.log("currentY", currentY);
    console.log("startY", startY);
    console.log("deltaY", deltaY);

    container.scrollTop(deltaY * 10);
    stopY = deltaY * 10;
    //   const newScrollTop =
    //   startScrollTop +
    //   deltaY * (container.scrollHeight / container.clientHeight);
    // container.scrollTop = newScrollTop;
  };

  const handleTouchEnd = (event) => {
    console.log("handleTouchEnd event", event);
    startY = stopY;
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
