import React, { useEffect } from "react";
import "./Preview.scss";

import { useStatePersist as useStickyState } from "use-state-persist";
import { schema } from "../utils";

import useStore from "../store/store";
export default function Preview() {
  const globalJson = useStore((state) => state.globalJson);

  const RenderTextPreview = (data) => {
    return (
      <>
        <div className="Preview-label">{data.label}</div>
        <input
          type="text"
          value={data.default && data.default !== "" ? data.default : ""}
          placeholder={
            data.placeholder && data.placeholder !== "" ? data.placeholder : ""
          }
          className="Preview-input"
        />

        {data.info && data.info !== "" && (
          <div className="Preview-info">{data.info}</div>
        )}
      </>
    );
  };

  const RenderBlogPreview = (data) => {
    return (
      <>
        <div className="Preview-label">{data.label}</div>
        <button id="" className="Preview-button" type="button">
          <span className="">
            <span className="">Select blog</span>
          </span>
        </button>

        {data.info && data.info !== "" && (
          <div className="Preview-info">{data.info}</div>
        )}
      </>
    );
  };

  const RenderCheckboxPreview = (data) => {
    return (
      <>
        <label
          className="Preview-checkbox-label"
          htmlFor={data.id + data.label}>
          <span className="Preview-checkbox-label-child">
            <span className="Preview-checkbox-label-grandchild">
              <input
                id={data.id + data.label}
                type="checkbox"
                className="Preview-checkbox-input"
                aria-checked="true"
                defaultValue=""
                defaultChecked=""
                checked={data.default}
              />
              <span className="Preview-checkbox-tick" />
              <span className="Preview-checkbox-tick-siblings">
                <span className="Preview-checkbox-tick-child">
                  <span className="Preview-checkbox-tick--hidden" />
                  <svg
                    viewBox="0 0 20 20"
                    className="Preview-checkbox-svg"
                    focusable="false"
                    aria-hidden="true">
                    <path d="M14.723 6.237a.94.94 0 0 1 .053 1.277l-5.366 6.193a.834.834 0 0 1-.611.293.83.83 0 0 1-.622-.264l-2.927-3.097a.94.94 0 0 1 0-1.278.82.82 0 0 1 1.207 0l2.297 2.43 4.763-5.498a.821.821 0 0 1 1.206-.056Z" />
                  </svg>
                </span>
              </span>
            </span>
          </span>
          <span className="">
            <span className="Preview-checkbox-text">Label for checkbox</span>
          </span>
        </label>

        {data.info && data.info !== "" && (
          <div className="Preview-info">{data.info}</div>
        )}
      </>
    );
  };

  const RenderColorPreview = (data) => {
    return (
      <>
        <div className="Preview-item-color-wrapper">
          <button
            style={{
              background:
                data.default && data.default !== "" ? data.default : "",
            }}
            type="button">
            <div className="Preview-color-button-helper"></div>
          </button>

          <div className="Preview-color-text">
            <label className="Preview-color-label">
              <div className="Preview-color-label-text">Label for checkbox</div>
            </label>

            <div className="Preview-color-hex">#FFFFFF</div>
          </div>
          <svg viewBox="0 0 20 20" className="Preview-color-svg">
            <path d="M10 9c3.866 0 7-1.343 7-3s-3.134-3-7-3-7 1.343-7 3 3.134 3 7 3Zm6.602 0c-.961 1.165-3.554 2-6.602 2-3.048 0-5.64-.835-6.602-2-.258.313-.398.65-.398 1 0 1.657 3.134 3 7 3s7-1.343 7-3c0-.35-.14-.687-.398-1Zm0 4c-.961 1.165-3.554 2-6.602 2-3.048 0-5.64-.835-6.602-2-.258.313-.398.65-.398 1 0 1.657 3.134 3 7 3s7-1.343 7-3c0-.35-.14-.687-.398-1Z" />
          </svg>
        </div>

        {data.info && data.info !== "" && (
          <div className="Preview-info">{data.info}</div>
        )}
      </>
    );
  };

  return (
    <div className="Preview">
      {globalJson &&
        globalJson.length >= 1 &&
        JSON.parse(globalJson).map((e) => {
          return (
            <div className={`Preview-item Preview-item--${e.type}`}>
              {(() => {
                if (e.type === "text") {
                  return <RenderTextPreview {...e} />;
                } else if (e.type === "blog") {
                  return <RenderBlogPreview {...e} />;
                } else if (e.type === "checkbox") {
                  return <RenderCheckboxPreview {...e} />;
                } else if (e.type === "color") {
                  return <RenderColorPreview {...e} />;
                }
              })()}
            </div>
          );
        })}
    </div>
  );
}
