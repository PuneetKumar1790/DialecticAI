import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./styles/global.css"
import "./styles/categories.css"
import "./styles/philosophers.css"
import "./styles/input.css"
import "./styles/responses.css"
import "./styles/debate.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
