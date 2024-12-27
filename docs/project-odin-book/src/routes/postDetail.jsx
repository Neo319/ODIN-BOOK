import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import NavBar from "../components/NavBar";

export default function PostDetail() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);

  const URL = import.meta.env.VITE_API_URL;
  const postId = useParams("id");

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

    //getting post data
    fetch(`${URL}/post/${encodeURIComponent(postId)}`)
      .then((res) => {
        res.json();
      })
      .then((postData) => {
        setData(postData);
      });
  }, [URL, postId]);

  console.log(postId);
  return (
    <>
      {NavBar(user, null)}
      <div className="main">
        <h1>Hi. Post Detail page here.</h1>
      </div>
    </>
  );
}
