import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import SignUp from "./routes/signUp.jsx";
import Login from "./routes/login.jsx";
import Logout from "./routes/logout.jsx";

import MyProfile from "./routes/myProfile.jsx";
import Follows from "./routes/follows.jsx";
import MyPosts from "./routes/myPosts.jsx";
import UserIndex from "./routes/userIndex.jsx";
import SearchPosts from "./routes/searchPosts.jsx";

import ServerTest from "./routes/servertest.jsx";
import PostDetail from "./routes/postDetail.jsx";
import CreatePost from "./routes/createPost.jsx";

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

  // ---- AUTHENTICATION ----
  {
    path: "signup",
    element: <SignUp />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "logout",
    element: <Logout />,
  },

  // ---- USERS & POSTS ----
  {
    path: "myProfile/:username", //include param username
    element: <MyProfile />,
  },
  {
    path: "follows", // include param username
    element: <Follows />,
  },
  {
    path: "myPosts", // include param username
    element: <MyPosts />,
  },

  {
    path: "userIndex",
    element: <UserIndex />,
  },
  {
    path: "searchPosts", // include param - any search queries
    element: <SearchPosts />,
  },
  {
    path: "postdetail/:id",
    element: <PostDetail />,
  },
  {
    path: "createPost",
    element: <CreatePost />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
