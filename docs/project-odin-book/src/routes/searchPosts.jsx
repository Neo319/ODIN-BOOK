import { useState, useEffect } from "react";

import NavBar from "../components/NavBar";
import PostCard from "../components/PostCard";

export default function SearchPosts() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

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

  return (
    <>
      {NavBar(user, "Search Posts")}
      <h1>Search Posts page here</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const search = document.forms[0][0].value;
          console.log(search);
          fetch(
            `${
              import.meta.env.VITE_API_URL
            }/searchPosts?search=${encodeURIComponent(search)}`
          )
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
              setPosts({ result: data });
            });
        }}
      >
        <input type="text" placeholder="Search by text content..." />
      </form>
    </>
  );
}
