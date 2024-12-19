import "../App.css";
import { useState, useEffect } from "react";

import NavBar from "../components/NavBar";
import Detail from "../components/Details";

export default function MyProfile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // retrieve posts to render on dashboard
    const URL = import.meta.env.VITE_API_URL;

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
  }, []);

  return user === null ? (
    <>Loading...</>
  ) : (
    <>
      {NavBar(user, "myProfile")}
      <div className="main">
        <h1>{"Profile of " + user.username}</h1>

        {/* TODO implement a default avatar */}
        <div>
          <img
            className="avatar"
            src={
              user.avatarURL == undefined
                ? import.meta.env.VITE_DEFAULT_AVATAR_URL
                : user.avatarURL
            }
            alt="avatar"
          />
        </div>
        <button>Edit Avatar...</button>

        <div className="detailDiv">
          <h2>User Info</h2>
          {!isEditing ? (
            Detail(
              {
                username: user.username,
                id: user.id,
                "created at": user.createdAt,
                bio: user.bio || "(No bio created yet!)",
              },
              true
            )
          ) : (
            <>editing</>
          )}
        </div>

        <div className="detailDiv">
          <h2>Posts and Comments</h2>
          {Detail(
            {
              posts: user.posts.length,
              comments: user.comments.length,
            },
            false
          )}
          <a href={"/myPosts"}>See My Posts & Comments... </a>
        </div>
      </div>
    </>
  );
}
