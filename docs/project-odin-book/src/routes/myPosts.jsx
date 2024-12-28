import { useState, useEffect } from "react";

import NavBar from "../components/NavBar";

// display all users you have followed
export default function MyPosts() {
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
      {NavBar(user, "myPosts")}
      <div className="main">
        <h1>Hi. My Posts page here.</h1>

        {user ? (
          <div>
            {/* 1: followingIds is defined */}
            {user.posts ? (
              <>
                <h2>your posts:</h2>

                {user.posts.length > 0 ? (
                  // 2: followingIds contains more than zero users
                  <ul>
                    {user.posts.map((post) => {
                      // temp: very simple list of ids.
                      <li>{post.id}</li>;
                    })}
                  </ul>
                ) : (
                  <p>You have not created any posts yet!</p>
                )}
              </>
            ) : (
              <>loading...</>
            )}
          </div>
        ) : (
          <>loading...</>
        )}
        <a href="">CREATE NEW POST... (WIP)</a>
      </div>
    </>
  );
}
