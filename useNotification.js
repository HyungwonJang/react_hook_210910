import { StrictMode } from "react";
import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

const useNotification = (title, options) => {
  if (!("Notification" in window)) {
    return;
  }
  const fireNotifi = () => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, options);
        } else {
          return;
        }
      });
    } else {
      new Notification(title, options);
    }
  };
  return fireNotifi;
};

const App = () => {
  const triggerNotifi = useNotification("Can I steal your Kimchi?", {body: "I love kimchi don't you?"});
  return (
    <div className="App" style={{ height: "1000vh" }}>
      <button onClick={triggerNotifi}>Hello</button>
    </div>
  );
};
const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  rootElement
);


// 알림이 뜨기는 함 하지만 undefined로 뜸