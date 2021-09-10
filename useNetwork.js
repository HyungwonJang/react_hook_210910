import {
  StrictMode
} from "react";
import React, {
  useState,
  useEffect,
  useRef
} from "react";
import ReactDOM from "react-dom";

const useNetwork = onchange => {
  const [status, setStatus] = useState(navigator.onLine)
  const handleChange = () => {
    if (typeof onchange === "function") {
      onchange(navigator.onLine)
    }
    setStatus(navigator.onLine)
  }
  useEffect(() => {
    window.addEventListener("online", handleChange);
    window.addEventListener("offline", handleChange);
    () => {
      window.removeEventListener("online", handleChange)
      window.removeEventListener("offline", handleChange)
    }
  }, [])
  return status;
}

const App = () => {
  const handleNetworkChange = (online) => {
    console.log(online ? "we just went online" : "we are offline")
  }
  const onLine = useNetwork()
  return ( <div className = "App" >
    <h1> {onLine ? "online" : "offline"} </h1> </div >
  );
};
const rootElement = document.getElementById("root");
ReactDOM.render( <StrictMode >
  <App />
  </StrictMode>,
  rootElement
);