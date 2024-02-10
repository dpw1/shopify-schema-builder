import React, { useState, useEffect, useRef } from "react";

import logo from "./logo.svg";
import "./App.scss";
import URL from "./components/URL";
import Creator from "./components/Creator";
import CodeTable from "./components/CodeTable";
import Sidebar from "./components/Sidebar";
import Section from "./components/Section";
import Header from "./components/Header";
import { useStatePersist as useStickyState } from "use-state-persist";

import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

import { duplicate, deleteItem, initialState, sleep } from "./utils";
import Preview from "./components/Preview";
import "./assets/Polaris.scss";
import "./components/PopupConfirm.scss";
import { AppProvider, Text, Tooltip } from "@shopify/polaris";
import TextExample from "./components/TextExample";
import RenderTextPreview from "./components/renders/RenderTextPreview";
import Editor from "./components/Editor";

import useStore from "./store/store";

function App() {
  const errors = useStore((state) => state.errors);
  const openOnClick = useStore((state) => state.openOnClick);
  const setOpenOnClick = useStore((state) => state.setOpenOnClick);

  useEffect(() => {
    setOpenOnClick(false);
    function addKeyListener() {
      function handleKeyDown(event) {
        if (event.ctrlKey && (event.key === "d" || event.key === "D")) {
          event.preventDefault();
          duplicate();
          openEditorForNextItem();
        }

        if (event.key === "Delete") {
          deleteItem();
        }
      }

      function addEventListenerOnce() {
        if (!isEventListenerAdded) {
          document.addEventListener("keydown", handleKeyDown);
          isEventListenerAdded = true;
        }
      }

      // Call the function to add the event listener
      addEventListenerOnce();
    }
    addKeyListener();
  }, []);

  function openEditorForNextItem() {
    setOpenOnClick(true);

    setTimeout(async () => {
      const $count = document.querySelector(`.Editor [data-item-count]`);

      if (!$count) {
        return;
      }
      const count = parseInt($count.getAttribute(`data-item-count`)) + 1;

      const $item = document.querySelector(`[data-item-count="${count}"]`);

      if (!$item) {
      }

      $item.click();

      await sleep(100);
      const $input = document.querySelector(`input[label='label']`);

      $input.focus();

      setOpenOnClick(false);
    }, 25);
  }

  return (
    <div className="App">
      <div className="container">
        <div className="">
          <AppProvider>
            <Header></Header>

            <div className="App-wrapper">
              <Preview />
              {/* <Creator /> */}

              <div
                className="Code"
                style={{
                  paddingBottom: 40,
                  paddingRight: 40,
                  overflowY: "scroll",
                }}>
                <div className="App-intro">
                  {" "}
                  <Text variant="heading4xl" as="h1">
                    EZFY Shopify Section Builder
                  </Text>
                  <Text variant="heading2xl" as="h2">
                    Coded by{" "}
                    <a target="_blank" href="https://ezfycode.com">
                      ezfycode.com
                    </a>
                  </Text>{" "}
                  <Text variant="headingMd" as="h3">
                    Copy & paste pre-made sections{" "}
                    <a
                      target="_blank"
                      href="https://ezfycode.com/shop?source=section-builder">
                      available here
                    </a>
                    .
                  </Text>{" "}
                </div>
                <CodeTable></CodeTable>
              </div>
            </div>
          </AppProvider>
        </div>
      </div>
      <ReactTooltip
        clickable={true}
        anchorSelect=".Preview-item"
        place={"right-start"}
        positionStrategy="fixed"
        offset={30}
        delayHide={0}
        openOnClick={openOnClick}
        render={({ content, activeAnchor }) => (
          <Editor props={content}></Editor>
        )}></ReactTooltip>
    </div>
  );
}

export default App;
