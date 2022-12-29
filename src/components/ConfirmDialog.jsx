import React from "react";

import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

import "./ConfirmDialog.scss";

export default function ConfirmDialog(props) {
  const { title, message, handleConfirm, handleDeny } = props;

  confirmAlert({
    title,
    message,
    buttons: [
      {
        label: "Yes",
        onClick: handleConfirm,
      },
      {
        label: "No",
        onClick: handleDeny,
      },
    ],
  });
  return <div className="confirmation">{confirmAlert}</div>;
}
