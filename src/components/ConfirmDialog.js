import React from "react";

import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

import "./ConfirmDialog.scss";

export default function ConfirmDialog(props) {
  const { title, message, confirm, deny } = props;

  confirmAlert({
    title,
    message,
    buttons: [
      {
        label: "Yes",
        onClick: confirm,
      },
      {
        label: "No",
        onClick: deny,
      },
    ],
  });
  return <div className="confirmation">{confirmAlert}</div>;
}
