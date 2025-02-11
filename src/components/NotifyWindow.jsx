import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useIdleTimerContext } from "react-idle-timer";
import SlotCounter from "react-slot-counter";

import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
export const NotifyWindow = ({
  isOpen,
  onNewUser,
  onPreviousUser,
  onTimerEnd,
  notifyProgressMax,
}) => {
  const { getRemainingTime } = useIdleTimerContext();
  const [remainingTime, setRemainingTime] = useState(notifyProgressMax);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime(
        Math.ceil((getRemainingTime() - notifyProgressMax) / 1000)
      );
      if (getRemainingTime() - notifyProgressMax <= 0) {
        clearInterval(interval);
        onTimerEnd();
      }
      // console.log("getRemainingTime()", getRemainingTime());
      // console.log("notifyProgressMax", notifyProgressMax);
    }, 500);

    return () => clearInterval(interval);
  }, [getRemainingTime, onTimerEnd]);

  if (!isOpen) return null;

  const seconds = Math.floor(remainingTime);
  console.log("seconds", seconds);
  return ReactDOM.createPortal(
    <div className="portal-overlay">
      <div className="portal-content notify">
        <div className="notify-bg">
          <div className="notify-circle-content-wrapper">
            <div className="circular-progressbar">
              <CircularProgressbarWithChildren
                minValue={0}
                maxValue={notifyProgressMax / 1000}
                value={remainingTime}
                strokeWidth={2}
                styles={{
                  root: {
                    width: "100%",
                  },
                  path: {
                    stroke: `rgba(255, 106, 20, ${
                      notifyProgressMax / 1000 / 100
                    })`,
                  },
                  trail: {
                    stroke: "rgba(255, 106, 20, 0.15)",
                  },
                }}
              >
                <SlotCounter
                  value={remainingTime}
                  className="slot-counter"
                  sequentialAnimationMode={true}
                  numberSlotClassName="counter-number"
                  valueClassName="counter-value"
                  useMonospaceWidth={true}
                />
              </CircularProgressbarWithChildren>
            </div>
            <div className="double-buttons-wrapper">
              <button
                onClick={onNewUser}
                className="footer-counter-btn notify-button"
              >
                Я новий покупець
              </button>
              <button
                onClick={onPreviousUser}
                className="footer-counter-btn  notify-button"
              >
                Я тут
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("portal-root")
  );
};
