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

  function submitNewPost() {
    const postData = document.getElementById("post").value;
    console.log("uploading - ", postData);

    fetch(`${URL}/post`, {
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ text: postData }),
    })
      .then((res) => {
        return res.json();
      })
      .then((result) => console.log(result));
  }

  return (
    <>
      {NavBar(user, null)}
      <div className="main">
        {user ? (
          <>
            <h1>create post route</h1>
            <p>Note: creating posts in this app is currently text only.</p>
            <form
              action=""
              onSubmit={(e) => {
                e.preventDefault();
                submitNewPost();
              }}
            >
              <label htmlFor="post">Post content: </label>
              <br />
              <textarea name="post" id="post"></textarea>
              <ul>
                <li>Post creator: {user.username}</li>
                <li>Created at {Date()}</li>
              </ul>

              <input type="submit" value="Create Post!" />
            </form>
          </>
        ) : (
          <>Loading...</>
        )}
      </div>
    </>
  );
}
