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

    case "checkbox":
      return (
        <FormItem
          itemCount={itemCount}
          options={["id", "label", "info", "default"]}
          type="checkbox"
          defaultOptions={{
            default: "true",
          }}
          handleOnFormChange={handleOnFormChange}
          itemId={itemId}
        />
      );

    case "range":
      return (
        <FormItem
          itemCount={itemCount}
          options={[
            "id",
            "label",
            "min",
            "max",
            "step",
            "unit",
            "info",
            "default",
          ]}
          type="richtext"
          defaultOptions={{
            unit: "px",
          }}
          handleOnFormChange={handleOnFormChange}
          itemId={itemId}
        />
      );
    case "textarea":
      return (
        <FormItem
          itemCount={itemCount}
          options={["id", "label", "info", "placeholder", "default"]}
          type="textarea"
          handleOnFormChange={handleOnFormChange}
          itemId={itemId}
        />
      );
    case "number":
      return (
        <FormItem
          itemCount={itemCount}
          options={["id", "label", "info", "default"]}
          type="number"
          handleOnFormChange={handleOnFormChange}
          itemId={itemId}
        />
      );
    case "select":
      return (
        <FormItem
          itemCount={itemCount}
          options={["id", "label", "info", "default"]}
          subOptions={["value", "label"]}
          totalSubOptions={5}
          type="select"
          handleOnFormChange={handleOnFormChange}
          itemId={itemId}
        />
      );
    case "radio":
      return (
        <FormItem
          itemCount={itemCount}
          options={["id", "label", "info", "default"]}
          subOptions={["value", "label"]}
          totalSubOptions={5}
          type="radio"
          handleOnFormChange={handleOnFormChange}
          itemId={itemId}
        />
      );
    case "article":
      return <p>"article"</p>;
    case "image_picker":
      return (
        <FormItem
          itemCount={itemCount}
          options={["id", "label", "info"]}
          type="image_picker"
          handleOnFormChange={handleOnFormChange}
          itemId={itemId}
        />
      );
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
  handleToggle,
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
        <button
          tabindex="-1"
          onClick={() => handleDeleteItem(id)}
          className="item-delete">
          Delete
        </button>
        {/* <button onClick={(e) => handleToggle(e)}>
          <svg
            width={16}
            height={16}
            fill="currentColor"
            className="bi bi-chevron-down"
            viewBox="0 0 16 16">
            <path
              fillRule="evenodd"
              d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
            />
          </svg>
        </button> */}
      </div>
      <div className="item-content">
        {renderElement(type, id, handleOnFormChange, itemCount)}
      </div>
      <br />
    </li>
  );
}
