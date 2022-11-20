import React from "react";
import Item from "./Item";

export default function List({ data }) {
  return (
    <div style={{marginTop: 2 + 'em'}}>
      <span className="list-title">
        <b>LEADERBOARD</b>
      </span>

      <ul className="item-wrapper">
        {data.map(row => (
          <Item row={row} key={row.address} />
        ))}
      </ul>
    </div>
  );
}