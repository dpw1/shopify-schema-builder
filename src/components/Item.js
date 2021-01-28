import React, { useState } from "react";
import { schema } from "./../utils";

import { useStatePersist as useStickyState } from "use-state-persist";
import Collapsible from "react-collapsible";
import "./Item.scss";

import Text from "./Text";
import FormItem from "./FormItem";

const renderElement = (type, itemId, handleOnFormChange) => {
  switch (type) {
    case "header":
      return (
        <FormItem
          options={["content"]}
          handleOnFormChange={handleOnFormChange}
          itemId={itemId}
        />
      );
    case "paragraph":
      return (
        <FormItem
          options={["content"]}
          handleOnFormChange={handleOnFormChange}
          itemId={itemId}
        />
      );
    case "text":
      return (
        <FormItem
          options={["id", "label", "default", "info"]}
          handleOnFormChange={handleOnFormChange}
          itemId={itemId}
        />
      );
    case "color":
      return (
        <FormItem
          options={["id", "label", "default", "info"]}
          handleOnFormChange={handleOnFormChange}
          itemId={itemId}
          defaultOptions={{
            default: "#ffffff",
          }}
        />
      );
    case "font_picker":
      return (
        <FormItem
          options={["id", "label", "default", "info"]}
          handleOnFormChange={handleOnFormChange}
          itemId={itemId}
        />
      );
    case "collection":
      return (
        <FormItem
          options={["id", "label", "info"]}
          handleOnFormChange={handleOnFormChange}
          itemId={itemId}
        />
      );
    case "product":
      return (
        <FormItem
          options={["id", "label", "info"]}
          handleOnFormChange={handleOnFormChange}
          itemId={itemId}
        />
      );
    case "blog":
      return (
        <FormItem
          options={["id", "label", "info"]}
          handleOnFormChange={handleOnFormChange}
          itemId={itemId}
        />
      );
    case "page":
      return (
        <FormItem
          options={["id", "label", "info"]}
          handleOnFormChange={handleOnFormChange}
          itemId={itemId}
        />
      );
    case "link_list":
      return (
        <FormItem
          options={["id", "label", "info"]}
          handleOnFormChange={handleOnFormChange}
          itemId={itemId}
        />
      );
    case "url":
      return (
        <FormItem
          options={["id", "label", "info"]}
          handleOnFormChange={handleOnFormChange}
          itemId={itemId}
        />
      );
    case "video_url":
      return (
        <FormItem
          options={["id", "label", "default", "accept", "placeholder", "info"]}
          handleOnFormChange={handleOnFormChange}
          itemId={itemId}
        />
      );
    case "richtext":
      return (
        <FormItem
          options={["id", "label", "info", "default"]}
          defaultOptions={{
            default: "<p></p>",
          }}
          handleOnFormChange={handleOnFormChange}
          itemId={itemId}
        />
      );

    case "range":
      return <p>"range"</p>;
    case "html":
      return <p>"html"</p>;
    case "article":
      return <p>"article"</p>;
    case "image_picker":
      return <p>"image_picker"</p>;
    default:
      return "none";
  }
};

export default function Item({
  defaultValue,
  name,
  type,
  id,
  handleOnFormChange,
  handleOnChange,
  register,
  handleDeleteItem,
  Content,
  handleDelete,
}) {
  const [items, setItems] = useStickyState("@items");

  return (
    <li className="item">
      <div className="item-wrapper">
        <select
          onChange={(e) => handleOnChange(e)}
          defaultValue={defaultValue}
          name={name}
          id={id}
          ref={register}>
          {schema.map(({ id: _id }) => {
            return (
              <option key={_id} value={_id}>
                {_id}
              </option>
            );
          })}
        </select>
        <button onClick={() => handleDeleteItem(id)} className="item-delete">
          Delete
        </button>
      </div>
      <div className="item-content">
        {renderElement(type, id, handleOnFormChange)}
      </div>
      <br />
    </li>
  );
}
