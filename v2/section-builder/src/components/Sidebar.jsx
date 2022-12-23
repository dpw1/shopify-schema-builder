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
    </div>
  );
}
