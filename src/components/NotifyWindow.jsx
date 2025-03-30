import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useIdleTimerContext } from "react-idle-timer";
import SlotCounter from "react-slot-counter";

import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useCancelBuyProductsMutation } from "../api/storeApi";
export const NotifyWindow = ({
  isOpen,
  onNewUser,
  onPreviousUser,
  onTimerEnd,
    getRemainingTime,
  timeout,
  promptBeforeIdle,
}) => {
  // const { getRemainingTime } = useIdleTimerContext();
  const [remainingTime, setRemainingTime] = useState(promptBeforeIdle / 1000);
  useEffect(() => {
    console.log("🔄 NotifyWindow mounted or updated");
    const timeLeftUntilIdle = getRemainingTime();
    const remainingSeconds = Math.floor(timeLeftUntilIdle / 1000);
       setRemainingTime(remainingSeconds);
    return () => console.log("🧹 NotifyWindow cleanup");
 
  }, []);
  useEffect(() => {
    if (!isOpen) return;
    console.log('remainingTime', remainingTime)
    console.log('promptBeforeIdle', promptBeforeIdle)
    console.log('promptBeforeIdle / 1000', promptBeforeIdle / 1000)
    const interval = setInterval(() => {
      const timeLeftUntilIdle = getRemainingTime();
      console.log("timeLeftUntilIdle", timeLeftUntilIdle);
      // const notifyCountdown = timeout - promptBeforeIdle;
      // const seconds = Math.ceil((timeLeftUntilIdle - notifyCountdown) / 1000);
const remainingSeconds = Math.floor(timeLeftUntilIdle / 1000);
      setRemainingTime(remainingSeconds);

      if (remainingTime <= 0) {
        clearInterval(interval);
        onTimerEnd();
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isOpen, getRemainingTime, onTimerEnd, remainingTime, promptBeforeIdle]);

  if (!isOpen) return null;

  // const seconds = Math.floor(remainingTime);
  // console.log("seconds", seconds);
  return ReactDOM.createPortal(
    <div className="portal-overlay">
      <div className="portal-content notify">
        <div className="notify-bg">
          <div className="notify-circle-content-wrapper">
            <div className="circular-progressbar">
              <CircularProgressbarWithChildren
                minValue={0}
                maxValue={promptBeforeIdle / 1000}
                value={remainingTime}
                strokeWidth={2}
                styles={{
                  root: {
                    width: "100%",
                  },
                  path: {
                    stroke: `rgba(255, 106, 20, ${
                      promptBeforeIdle / 1000 / 100
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
