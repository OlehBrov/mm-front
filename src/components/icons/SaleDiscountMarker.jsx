import React from "react";

const SALETYPENAMES = {
  1: "знижка",
  2: "знижка",
  3: "новинка",
  4: "знижка",
  5: "",
  6: "товар дня",
  7: "комбо",
  8: "дубль",
  9: "знижка"
};

export const SaleDiscountMarker = (props) => {
  if (!props.type || props.type === 0) return;
  let discount;
  const markerText = SALETYPENAMES[props.type].toUpperCase();
  if (
    props.type === 1 ||
    props.type === 2 ||
    (props.type === 4 && props.value) ||
    (props.type === 9 && props.value)
  ) {
    discount = Number(props.value) * 100;
  }
  return (
    <div className={`sale-marker marker-bg-${props.type}`}>
      {!discount && <p>{markerText}</p>}
      {discount && <p>{`${markerText} -${discount}%`}</p>}
    </div>
  );
};
