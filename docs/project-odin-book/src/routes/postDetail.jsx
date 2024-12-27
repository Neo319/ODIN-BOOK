import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import NavBar from "../components/NavBar";
import Detail from "../components/Details";

export default function PostDetail() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);

  const URL = import.meta.env.VITE_API_URL;
  const params = useParams();

  useEffect(() => {
    //getting post data
    fetch(`${URL}/post/${encodeURIComponent(params.id)}`)
      .then((res) => {
        return res.json();
      })
      .then((postData) => {
        console.log(postData);
        setData({
          id: postData.result.id,
          creatorId: postData.result.creatorId,
          creator: postData.result.creator.username,
          content: postData.result.content,
          createdAt: postData.result.createdAt,
          likes: postData.result.likes,
        });
      });

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
  }, [URL, params]);

  // TODO: implementing comments and LIKE BUTTON here.

  return (
    <>
      {NavBar(user, null)}
      <div className="main">
        <h1>Post Detail</h1>

        <div>
          <h2>Info:</h2>
          {Detail(data, false)}
        </div>

        <div>
          <h2>Comments:</h2>
          <span>WIP</span>
        </div>
      </div>
    </>
  );
}
