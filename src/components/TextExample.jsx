import React, { useEffect, useState } from "react";

import { Tooltip as ReactTooltip } from "react-tooltip";

function TextExample(props) {
  const name = !props?.name ? "null" : props.name;

  return <div>Choice: {name}</div>;
}

export default TextExample;
