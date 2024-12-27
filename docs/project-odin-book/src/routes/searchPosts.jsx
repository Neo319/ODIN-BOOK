import { useState, useEffect } from "react";

import NavBar from "../components/NavBar";
import PostCard from "../components/PostCard";

export default function SearchPosts() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState({ result: [] });
  const [loading, setLoading] = useState(true);

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

    fetch(`${URL}/searchPosts/`).then((res) => {
      res.json().then((data) => {
        setPosts(data);
        setLoading(false);
      });
    });
  }, [URL]);

  return (
    <>
      {NavBar(user, "Search Posts")}
      <div className="main">
        <h1>Search Posts page here</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setLoading(true);
            setPosts({ result: [] });
            const search = document.getElementById("search").value;
            console.log(search);
            fetch(
              `${
                import.meta.env.VITE_API_URL
              }/searchPosts?search=${encodeURIComponent(search)}`
            )
              .then((res) => res.json())
              .then((data) => {
                console.log(data);
                setPosts(data);
                setLoading(false);
              });
          }}
        >
          <input
            id="search"
            type="text"
            placeholder="Search by text content..."
          />
        </form>

        {/* rendering posts */}
        <div>
          {!loading && posts.result.length > 0 ? (
            <>
              <ul>
                {posts.result.map((post) => {
                  return (
                    <li key={"dashboard#" + post.id}>
                      <PostCard {...post} />
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <>Loading posts...</>
          )}
        </div>
      </div>
    </>
  );
}
