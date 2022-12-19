import React, { useEffect } from "react";
import SectionEditor from "./SectionEditor";
import "./Sidebar.scss";

import { useStatePersist as useStickyState } from "use-state-persist";
import { initialState } from "../utils";

export default function Sidebar(props) {
  const [activeSection, setActiveSection] = useStickyState(
    "activeSection",
    false,
  );

  useEffect(() => {
    console.log("is section active", activeSection);
  }, [activeSection]);

  return (
    <div className="Sidebar">
      <div className="Sidebar-sections">{props.children}</div>

      <div className="Sidebar-current">
        {activeSection !== null && <SectionEditor></SectionEditor>}
      </div>

      {/* <button className="Sidebar-add">
        <svg
          viewBox="0 0 20 20"
          className="Polaris-Icon__Svg_375hu"
          focusable="false"
          aria-hidden="true">
          <path d="M15 10a1 1 0 0 1-1 1h-3v3a1 1 0 1 1-2 0v-3h-3a1 1 0 1 1 0-2h3v-3a1 1 0 0 1 2 0v3h3a1 1 0 0 1 1 1zm-5-8a8 8 0 1 0 0 16 8 8 0 0 0 0-16z" />
        </svg>

        <span>Add</span>
      </button> */}
    </div>
  );
}
