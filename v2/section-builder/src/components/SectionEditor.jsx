import React, { useEffect } from "react";

import { createGlobalState } from "react-hooks-global-state";
import { initialState } from "../utils";

import { useStatePersist as useStickyState } from "use-state-persist";
import Form from "./Form";
import SectionItem from "./SectionItem";

export default function SectionEditor() {
  const [activeSection, setActiveSection] = useStickyState(
    "activeSection",
    false,
  );

  useEffect(() => {
    console.log(
      "is section active (from sectioneditor)",
      activeSection,
      initialState["activeSection"],
    );
  }, [activeSection]);

  return (
    <div className="SectionEditor">
      {activeSection && (
        <div>
          <SectionItem></SectionItem>
        </div>
      )}
    </div>
  );
}
