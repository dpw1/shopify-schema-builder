import React, { useState } from "react";
import "./Section.scss";

import { useNavigate } from "react-router-dom";

import { initialState } from "../utils";

import { useStatePersist as useStickyState } from "use-state-persist";

export default function Section() {
  const [activeSection, setActiveSection] = useStickyState(
    "activeSection",
    false,
  );

  const sectionName = `test dummy`;
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        // Somewhere in your code, e.g. inside a handler:
        setActiveSection(sectionName);
        navigate(`/${sectionName}`);
      }}
      className="Section">
      <div className="Section-expand">
        <svg viewBox="0 0 20 20">
          <path d="M13.098 8h-6.196c-.751 0-1.172.754-.708 1.268l3.098 3.432c.36.399 1.055.399 1.416 0l3.098-3.433c.464-.513.043-1.267-.708-1.267Z" />
        </svg>
      </div>
      <div className="Section-image"></div>
      <div className="Section-title">{sectionName}</div>
    </div>
  );
}
