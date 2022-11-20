import React from "react";

export default function Item({ row }) {
  return (
    <li className="item">
      <span className="item__name">{row.address}</span>
      <span className="item__score">{row.waves}</span>
    </li>
  );
}
