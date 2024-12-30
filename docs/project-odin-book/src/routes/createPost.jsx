import { useState, useEffect } from "react";

import NavBar from "../components/NavBar";

export default function CreatePost() {
  const [user, setUser] = useState();

  const URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    // determine if user is logged in
    if (token) {
      fetch(`${URL}/user/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) {
            localStorage.clear("token");
            return null;
          }
          return res.json();
        })
        .then((data) => {
          setUser(data);
        });
    }
  }, [URL]);
  return (
    <>
      {NavBar(user, null)}
      <div className="main">
        {user ? (
          <>
            <h1>create post route</h1>
            <p>Note: creating posts in this app is currently text only.</p>
            <form action="">
              <label htmlFor="post">Post content: </label>
              <br />
              <textarea name="post" id="post"></textarea>
            </form>
            <ul>
              <li>Post creator: {user.username}</li>
              <li>Created at {Date()}</li>
            </ul>
          </>
        ) : (
          <>Loading...</>
        )}
      </div>
    </>
  );
}
