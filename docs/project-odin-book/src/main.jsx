import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

// import SignUp from "./routes/signup.jsx";
// import Login from "./routes/login.jsx";
// import Dashboard from "./routes/dashboard.jsx";
// import Message from "./routes/message.jsx";

import ServerTest from "./routes/servertest.jsx";

// client side routes.
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/servertest",
    element: <ServerTest />,
  },

  // {
  //   path: "signup",
  //   element: <SignUp />,
  // },
  // {
  //   path: "login",
  //   element: <Login />,
  // },
  // {
  //   path: "dashboard",
  //   element: <Dashboard />,
  // },
  // {
  //   path: "message/:user",
  //   element: <Message />,
  // },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
