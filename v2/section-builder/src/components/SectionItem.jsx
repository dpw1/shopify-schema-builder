import React from "react";
import { schema } from "../utils";

export default function SectionItem() {
  return (
    <div className="SectionItem">
      <div className="SectionItem-item-wrapper">
        <select id={"11"}>
          {schema
            .sort((a, b) => a.id.localeCompare(b.id))
            .map(({ id: _id }) => {
              return (
                <option key={_id} value={_id}>
                  {_id}
                </option>
              );
            })}
        </select>

        <input type="text" />
        <textarea name="" id="" cols="30" rows="10"></textarea>
      </div>
    </div>
  );
}
