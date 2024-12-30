import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import NavBar from "../components/NavBar";
import Detail from "../components/Details";

export default function PostDetail() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [avatar, setAvatar] = useState(null);

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
        setAvatar(postData.result.creator.avatarURL);
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

  return (
    <>
      {NavBar(user, null)}
      <div className="main">
        <h1>Post Detail</h1>

        <div>
          <h2>Info:</h2>
          <img
            src={avatar || import.meta.env.VITE_DEFAULT_AVATAR_URL}
            alt="avatar"
            className="avatar postAvatar"
          />
          {Detail(data, false)}
        </div>

        {user ? (
          <button
            onClick={() => {
              console.log(data.id);
              fetch(`${URL}/post/${data.id}/like`, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${localStorage.token}`,
                  "Content-Type": "application/json",
                },
              })
                .then((res) => {
                  return res.json();
                })
                .then((result) => {
                  console.log(result);
                  if (result.success) {
                    window.location.reload();
                  }
                });
            }}
          >
            Like this Post ... (WIP)
          </button>
        ) : (
          <></>
        )}

        <div>
          <h2>Comments:</h2>
          <span>WIP</span>
        </div>
      </div>
    </>
  );
}
