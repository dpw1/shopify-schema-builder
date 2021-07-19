import React, { useState } from "react";
import { schema } from "./../utils";

import { useStatePersist as useStickyState } from "use-state-persist";
import Collapsible from "react-collapsible";
import "./Item.scss";

import Text from "./Text";
import FormItem from "./FormItem";

const renderElement = (type, itemId, handleOnFormChange, itemCount) => {
  switch (type) {
    case "header":
      return (
        <FormItem
          itemCount={itemCount}
          options={["content"]}
          handleOnFormChange={handleOnFormChange}
          type={"header"}
          itemId={itemId}
          defaultOptions={{
            content: "Options",
          }}
        />
      );
    case "paragraph":
      return (
        <FormItem
          itemCount={itemCount}
          options={["content"]}
          type={"paragraph"}
          handleOnFormChange={handleOnFormChange}
          itemId={itemId}
        />
      );
    case "text":
      return (
        <FormItem
          itemCount={itemCount}
          options={["id", "label", "default", "info"]}
          type="text"
          handleOnFormChange={handleOnFormChange}
          itemId={itemId}
        />
      );
    case "color":
      return (
        <FormItem
          itemCount={itemCount}
          options={["id", "label", "default", "info"]}
          type="color"
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
          itemCount={itemCount}
          options={["id", "label", "default", "info"]}
          type="font_picker"
          handleOnFormChange={handleOnFormChange}
          itemId={itemId}
        />
      );
    case "collection":
      return (
        <FormItem
          itemCount={itemCount}
          options={["id", "label", "info"]}
          type="collection"
          handleOnFormChange={handleOnFormChange}
          itemId={itemId}
        />
      );
    case "product":
      return (
        <FormItem
          itemCount={itemCount}
          options={["id", "label", "info"]}
          type="product"
          handleOnFormChange={handleOnFormChange}
          itemId={itemId}
        />
      );
    case "blog":
      return (
        <FormItem
          itemCount={itemCount}
          options={["id", "label", "info"]}
          type="blog"
          handleOnFormChange={handleOnFormChange}
          itemId={itemId}
        />
      );
    case "page":
      return (
        <FormItem
          itemCount={itemCount}
          options={["id", "label", "info"]}
          type="page"
          handleOnFormChange={handleOnFormChange}
          itemId={itemId}
        />
      );
    case "link_list":
      return (
        <FormItem
          itemCount={itemCount}
          options={["id", "label", "info"]}
          type="link_list"
          handleOnFormChange={handleOnFormChange}
          itemId={itemId}
        />
      );
    case "url":
      return (
        <FormItem
          itemCount={itemCount}
          options={["id", "label", "info"]}
          type="url"
          handleOnFormChange={handleOnFormChange}
          itemId={itemId}
        />
      );
    case "video_url":
      return (
        <FormItem
          itemCount={itemCount}
          options={["id", "label", "default", "accept", "placeholder", "info"]}
          type="video_url"
          handleOnFormChange={handleOnFormChange}
          itemId={itemId}
        />
      );
    case "richtext":
      return (
        <FormItem
          itemCount={itemCount}
          options={["id", "label", "info", "default"]}
          type="richtext"
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
  itemCount,
  Content,
  handleDelete,
}) {
  return (
    <li data-item-count={itemCount} className={`item`}>
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
        {renderElement(type, id, handleOnFormChange, itemCount)}
      </div>
      <br />
    </li>
  );
}
