import React from "react";
import Countdown from "react-countdown";
import ReactDOM from "react-dom";

const renderer = ({ seconds, completed }) => {
  if (completed) {
    // Render a completed state
  } else {
    // Render a countdown
    return <span>{seconds}</span>;
  }
};

export const NotifyWindow = ({
  isOpen,
  onClose,
  onNewUser,
    onPreviousUser,
  onTimerEnd
}) => {
  if (!isOpen) {
    return null; // Do not render anything if the modal is closed
  }

  // Use ReactDOM.createPortal to render children into a different DOM node
  return ReactDOM.createPortal(
    <div className="portal-overlay">
      <div className="portal-content">
        <Countdown
          date={Date.now() + 30000}
          renderer={renderer}
          onComplete={onTimerEnd}
        />
        ,<button onClick={onNewUser}>New user</button>
        <button onClick={onPreviousUser}>Previous user</button>
        {/* <button onClick={onClose}>Close</button> */}
      </div>
    </div>,
    document.getElementById("portal-root") // Render into the modal-root DOM node
  );
};
