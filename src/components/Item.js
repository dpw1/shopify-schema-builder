import React, { useState, useEffect, useRef } from "react";
import {
  addToIndex,
  schema,
  sleep,
  transformDOMIntoJSON,
  generateJSONAndVariables,
  resetJsonResult,
} from "./../utils";

import { useStatePersist as useStickyState } from "use-state-persist";
import Collapsible from "react-collapsible";
import short from "short-uuid";
import "./Item.scss";

import Text from "./Text";
import FormItem from "./FormItem";

import useStore from "../store/store";

const renderElement = (
  type,
  itemId,
  handleOnFormChange,
  itemCount,
  duplicatedOptions,
  duplicatedSubOptions,
  defaultOptions,
) => {
  switch (type) {
    case "header":
      return (
        <FormItem
          itemCount={itemCount}
          options={["content"]}
          handleOnFormChange={handleOnFormChange}
          type={"header"}
          itemId={itemId}
          duplicatedOptions={duplicatedOptions}
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
          duplicatedOptions={duplicatedOptions}
          handleOnFormChange={handleOnFormChange}
          itemId={itemId}
        />
      );
    case "text":
      return (
        <FormItem
          itemCount={itemCount}
          options={["id", "label", "info", "default"]}
          type="text"
          duplicatedOptions={duplicatedOptions}
          defaultOptions={defaultOptions}
          handleOnFormChange={handleOnFormChange}
          itemId={itemId}
        />
      );
    case "color":
      return (
        <FormItem
          itemCount={itemCount}
          options={["id", "label", "info", "default"]}
          type="color"
          duplicatedOptions={duplicatedOptions}
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
          options={["id", "label", "info", "default"]}
          type="font_picker"
          duplicatedOptions={duplicatedOptions}
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
          duplicatedOptions={duplicatedOptions}
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
          duplicatedOptions={duplicatedOptions}
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
          duplicatedOptions={duplicatedOptions}
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
          duplicatedOptions={duplicatedOptions}
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
          duplicatedOptions={duplicatedOptions}
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
          duplicatedOptions={duplicatedOptions}
          handleOnFormChange={handleOnFormChange}
          itemId={itemId}
        />
      );
    case "video_url":
      return (
        <FormItem
          itemCount={itemCount}
          options={["id", "label", "accept", "placeholder", "info", "default"]}
          type="video_url"
          duplicatedOptions={duplicatedOptions}
          duplicatedOptions={duplicatedOptions}
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
          duplicatedOptions={duplicatedOptions}
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
          duplicatedOptions={duplicatedOptions}
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
          duplicatedOptions={duplicatedOptions}
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
          duplicatedOptions={duplicatedOptions}
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
          duplicatedOptions={duplicatedOptions}
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
          duplicatedOptions={duplicatedOptions}
          duplicatedSubOptions={duplicatedSubOptions}
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
          duplicatedOptions={duplicatedOptions}
          handleOnFormChange={handleOnFormChange}
          itemId={itemId}
        />
      );
    case "image_picker":
      return (
        <FormItem
          itemCount={itemCount}
          options={["id", "label", "info"]}
          type="image_picker"
          duplicatedOptions={duplicatedOptions}
          handleOnFormChange={handleOnFormChange}
          itemId={itemId}
        />
      );
    default:
      return "none";
  }
};

export default function Item(props) {
  let {
    defaultValue,
    name,
    type,
    id,
    handleOnFormChange,
    handleOnChange,
    register,
    setValue,
    handleDeleteItem,
    defaultOptions,
    itemCount,
    isToggled,
    handleToggle,
    handleDelete,
    duplicatedOptions,
    duplicatedSubOptions,
  } = props;

  const items = useStore((state) => state.items);
  const updateItems = useStore((state) => state.updateItems);

  /* TODO 
  "duplicatedItemOptions' should receive the _json data. */

  /** Responsible to duplicate items. */
  const handleDuplicate = async () => {
    /* "$this" is modified once "setItems" is updated. */
    let $this = document.querySelector(`.item[data-item-count="${itemCount}"]`);

    let _json = transformDOMIntoJSON($this);
    delete _json.type;

    console.log("my josn", _json);

    /* ====== */
    const index = parseInt(itemCount) - 1;

    const _item = {
      id: short.generate(),
      type,
      duplicatedOptions: _json,
    };

    const updatedItems = addToIndex(items, index, _item);
    updateItems(updatedItems);

    generateJSONAndVariables();
  };

  return (
    <li
      data-item-count={itemCount}
      className={`item ${isToggled ? "item--toggle" : ""}`}>
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
          onClick={() => {
            resetJsonResult();
            handleDeleteItem(id);
          }}
          className="item-delete item-button">
          Delete
        </button>
        <button
          onClick={() => {
            handleDuplicate();
          }}
          className="item-button">
          Dup
        </button>
        <button
          className="item-button  item-button--toggle"
          onClick={(e) => handleToggle(e, id)}>
          {
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
          }
        </button>
      </div>
      <div className="item-content">
        {renderElement(
          type,
          id,
          handleOnFormChange,
          itemCount,
          duplicatedOptions,
          duplicatedSubOptions,
        )}
      </div>
      <br />
    </li>
  );
}
