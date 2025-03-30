import React, { useEffect, useRef, useState } from "react";
import SlotCounter from "react-slot-counter";

export const CartTimer = ({ start, cancelFunction, currentPaymentCount }) => {
   const [counterRemainTime, setCounterRemainTime] = useState(60);
   const intervalRef = useRef(null);
   const prevPaymentCount = useRef(currentPaymentCount);

   const startCountdown = () => {
     clearInterval(intervalRef.current);
     setCounterRemainTime(60);

     intervalRef.current = setInterval(() => {
       setCounterRemainTime((prev) => {
         if (prev <= 1) {
           clearInterval(intervalRef.current);
           cancelFunction();
           return 0;
         }
         return prev - 1;
       });
     }, 1000);
   };

   useEffect(() => {
     if (start) {
       startCountdown();
     }

     return () => clearInterval(intervalRef.current);
   }, [start]);

   useEffect(() => {
     if (prevPaymentCount.current === 1 && currentPaymentCount === 2 && start) {
       console.log("🟢 Restarting countdown due to currentPaymentCount === 2");
       startCountdown();
     }

     // Update the previous count
     prevPaymentCount.current = currentPaymentCount;
   }, [currentPaymentCount, start]);
  return (
      <div className="cart-slot-wrapper">
          <p className="cart-counter-heading">Залишилось часу на оплату:</p>
      <SlotCounter
        value={counterRemainTime}
        className="cart-slot-counter"
        sequentialAnimationMode={true}
        numberSlotClassName="counter-number"
        valueClassName="counter-value"
        useMonospaceWidth={true}
      />
    </div>
  );
};
