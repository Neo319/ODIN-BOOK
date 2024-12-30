import { useState, useEffect } from "react";
import "../App.css";

import NavBar from "../components/NavBar";

// display all users you have followed
export default function Follows() {
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
      {NavBar(user, "follows")}
      <div className="main">
        <h1>Hi. Follows page here.</h1>

        {user ? (
          <div>
            {/* 1: followingIds is defined */}
            {user.followingIds ? (
              <>
                <h2>Users you are following:</h2>
                <p>debug: {JSON.stringify(user)}</p>

                {user.followingIds.length > 0 ? (
                  // 2: followingIds contains more than zero users
                  <ul>
                    {user.followingIds.map((followedUser) => {
                      // temp: very simple list of names.
                      <li>{followedUser.username}</li>;
                    })}
                  </ul>
                ) : (
                  <p>You are not following any users yet!</p>
                )}
              </>
            ) : (
              <>loading...</>
            )}
          </div>
        ) : (
          <>loading...</>
        )}
      </div>
    </>
  );
}
