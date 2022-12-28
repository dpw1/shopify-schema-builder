import React from "react";
import "./SidebarOptions.scss";
import {
  Select,
  RangeSlider,
  TextField,
  Button,
  Tooltip,
  Text,
} from "@shopify/polaris";
import {
  DragHandleMinor,
  ChevronLeftMinor,
  ColorsMajor,
} from "@shopify/polaris-icons";

export default function SidebarOptions() {
  return (
    <div className="SidebarOptions">
      <div className="SidebarOptions-buttons">
        <Tooltip content="Copy Liquid code" dismissOnMouseOut>
          <Button>L</Button>
        </Tooltip>
        <Tooltip content="Copy CSS" dismissOnMouseOut>
          <Button>
            <ColorsMajor></ColorsMajor>
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}
