import { createRoot } from "react-dom/client";
import { App } from "./App";
const insert = document.getElementById("react-root");
if (!insert) {
  throw new Error("Couldn't find mount point");
}
const root = createRoot(insert);
root.render(<App />);
