import React, { useState, useEffect, useRef } from "react";
import {
  addToIndex,
  schema,
  sleep,
  transformDOMIntoJSON,
  resetJsonResult,
  generateJSONSchema,
  setJsonResult,
  scrollToItem,
} from "./../utils";

import short from "short-uuid";
import "./Item.scss";

import Text from "./Text";
import FormItem from "./FormItem";

import useStore from "../store/store";
import { Select } from "@shopify/polaris";

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
          options={["id", "label", "info", "placeholder", "default"]}
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
          defaultOptions={{
            default: "sans-serif",
          }}
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
          options={["id", "label", "info", "placeholder", "default"]}
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
    sortableHandle,
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

    const id = short.generate();

    const _item = {
      id,
      type,
      duplicatedOptions: _json,
    };

    const updatedItems = addToIndex(items, index, _item);
    updateItems(updatedItems);

    await sleep(100);
    scrollToItem(id);
  };

  const DragHandle = sortableHandle(() => (
    <span className="item-button" tabIndex={0}>
      <button
        className="item-button item-button--drag"
        tabIndex={-1}
        style={{ pointerEvents: "none" }}>
        <svg viewBox="0 0 20 20">
          <path d="M7 2a2 2 0 1 0 .001 4.001 2 2 0 0 0-.001-4.001zm0 6a2 2 0 1 0 .001 4.001 2 2 0 0 0-.001-4.001zm0 6a2 2 0 1 0 .001 4.001 2 2 0 0 0-.001-4.001zm6-8a2 2 0 1 0-.001-4.001 2 2 0 0 0 .001 4.001zm0 2a2 2 0 1 0 .001 4.001 2 2 0 0 0-.001-4.001zm0 6a2 2 0 1 0 .001 4.001 2 2 0 0 0-.001-4.001z" />
        </svg>
      </button>
    </span>
  ));

  const [selected, setSelected] = useState("today");

  const handleSelectChange = React.useCallback(
    (value) => setSelected(value),
    [],
  );

  const options = schema
    .sort((a, b) => a.id.localeCompare(b.id))
    .map(({ id: _id }) => {
      return {
        label: _id,
        value: _id,
      };
    });

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
        {/* <Select
          options={options}
          defaultValue={defaultValue}
          name={name}
          id={id}
          ref={register}
          onChange={(e) => {
            handleSelectChange(e);
            handleOnChange(e);
          }}
          value={selected}
        /> */}
        <div className="item-buttons">
          <button
            title="Delete"
            tabindex="-1"
            onClick={async () => {
              resetJsonResult();
              handleDeleteItem(id);
              await sleep(100);
              const json = generateJSONSchema();
              setJsonResult(json);
            }}
            className="item-delete item-button">
            <svg viewBox="0 0 20 20" focusable="false" aria-hidden="true">
              <path d="M8 3.994c0-1.101.895-1.994 2-1.994s2 .893 2 1.994h4c.552 0 1 .446 1 .997a1 1 0 0 1-1 .997h-12c-.552 0-1-.447-1-.997s.448-.997 1-.997h4zm-3 10.514v-6.508h2v6.508a.5.5 0 0 0 .5.498h1.5v-7.006h2v7.006h1.5a.5.5 0 0 0 .5-.498v-6.508h2v6.508a2.496 2.496 0 0 1-2.5 2.492h-5c-1.38 0-2.5-1.116-2.5-2.492z" />
            </svg>
          </button>
          <button
            title="Duplicate"
            onClick={() => {
              handleDuplicate();
            }}
            className="item-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 14 14"
              height={32}
              width={32}
              strokeWidth={1}>
              <g>
                <rect
                  x={3}
                  y={3}
                  width="10.5"
                  height="10.5"
                  rx={1}
                  transform="translate(16.5 16.5) rotate(180)"
                  fill="none"
                  stroke="#000000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M.5,10.5v-9a1,1,0,0,1,1-1h9"
                  fill="none"
                  stroke="#000000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
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
          <DragHandle />
        </div>
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
