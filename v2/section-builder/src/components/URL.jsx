import React from "react";
import { useForm } from "react-hook-form";
import "./URL.scss";
import short from "short-uuid";
import { sortableContainer, sortableElement } from "react-sortable-hoc";
import arrayMove from "array-move";

import { useStatePersist as useState } from "use-state-persist";

const SortableItem = sortableElement(({ value }) => <li>{value}</li>);

const SortableContainer = sortableContainer(({ children }) => {
  return <ul>{children}</ul>;
});

function URL() {
  const { register, handleSubmit, watch, errors } = useForm();
  const [items, setItems] = useState("@items", []);

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setItems(arrayMove(items, oldIndex, newIndex));
  };

  const onSubmit = (data) => {
    const { url, label, info } = data;

    const item = {
      type: "url",
      url,
      label,
      info,
    };

    setItems([...items, item]);
  };

  return (
    <div className="shopify-component shopify-component-url">
      <SortableContainer onSortEnd={onSortEnd}>
        {items.map((value, i) => (
          <SortableItem
            key={`item-${short.generate()}`}
            index={i}
            value={value}
          />
        ))}
      </SortableContainer>

      <div className="container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <input ref={register} type="text" name="id" placeholder="ID" />
          <input ref={register} type="text" name="label" placeholder="URL" />
          <input
            ref={register}
            type="text"
            name="info"
            placeholder={`"Choose a link."`}
          />

          <input type="submit" value="submit" />
        </form>
      </div>
    </div>
  );
}

export default URL;
