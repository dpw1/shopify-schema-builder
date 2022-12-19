import React from "react";
import "./Header.scss";

export default function Header() {
  return (
    <div className="Header">
      <div className="Header-left">
        <svg
          viewBox="0 0 20 20"
          className="Polaris-Icon__Svg_375hu"
          focusable="false"
          aria-hidden="true">
          <path d="M7.703 13.707a.997.997 0 0 0 0-1.414l-1.294-1.293h6.589a1 1 0 1 0 0-2h-6.589l1.294-1.293a1 1 0 1 0-1.415-1.414l-3.001 3a.994.994 0 0 0-.198.298c-.013.027-.021.054-.03.082a.944.944 0 0 0-.054.269l-.001.027a.937.937 0 0 0 .062.398l.003.012v.004c.048.112.117.208.197.294l.01.015.01.015 3.002 3a1 1 0 0 0 1.415 0z" />
          <path d="M2 16.5a1.5 1.5 0 0 0 1.5 1.5h13a1.5 1.5 0 0 0 1.5-1.5v-13a1.5 1.5 0 0 0-1.5-1.5h-13a1.5 1.5 0 0 0-1.5 1.5v1.5a1 1 0 1 0 2 0v-1h12v12h-12v-1a1 1 0 1 0-2 0v1.5z" />
        </svg>
      </div>
    </div>
  );
}
