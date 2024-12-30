import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import NavBar from "../components/NavBar";
import Detail from "../components/Details";

export default function PostDetail() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [comments, setComments] = useState(null);

  const URL = import.meta.env.VITE_API_URL;
  const params = useParams();

  // TODO: update JWT token with new info after adding likes, follows, etc.
  function createNewToken() {
    fetch(`${URL}/updateToken/`, {
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
          localStorage.removeItem("token");
          localStorage.setItem("token", result.token);
        }
      });
  }

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
        setComments(postData.comments);
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

          {data ? (
            <>
              <img
                src={avatar || import.meta.env.VITE_DEFAULT_AVATAR_URL}
                alt="avatar"
                className="avatar postAvatar"
              />
              <br />
              {Detail(data, false)}
            </>
          ) : (
            <>Loading post... </>
          )}
        </div>

        {user ? (
          <>
            {/* LIKE POST BUTTON */}
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
              Like this Post ...
            </button>

            {/* FOLLOW USER BUTTON */}
            <button
              onClick={() => {
                fetch(`${URL}/follow`, {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${localStorage.token}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ userId: data.creatorId }),
                })
                  .then((res) => {
                    return res.json();
                  })
                  .then((result) => {
                    console.log(result);
                    if (result.success) {
                      alert("added new followed user!");
                      createNewToken();
                    }
                  });
              }}
            >
              Follow {data.creator}...
            </button>
          </>
        ) : (
          <></>
        )}

        <div>
          <h2>Comments:</h2>
          {Array.isArray(comments) ? (
            <div>
              {comments.length > 0 ? (
                comments.map((comment) => {
                  return (
                    <li key={comment.id} className="commentLi">
                      <img
                        src={
                          comment.creator.avatarURL ||
                          import.meta.env.VITE_DEFAULT_AVATAR_URL
                        }
                        alt="avatar"
                      />
                      <b>{comment.creator.username} :</b>
                      <span>{comment.content}</span>
                    </li>
                  );
                })
              ) : (
                <>This post has no comments yet!</>
              )}
              <br />
              debug: comments = {JSON.stringify(comments)}
            </div>
          ) : (
            <></>
          )}

          {user ? (
            <button
              onClick={() => {
                // unhide comment form
                document.getElementById("comment").hidden = false;
              }}
            >
              Comment on this post ...
            </button>
          ) : (
            <></>
          )}

          <form
            id="comment"
            hidden
            onSubmit={(e) => {
              e.preventDefault();
              const content = document.getElementById("commentText").value;

              fetch(`${URL}/post/${data.id}/comment`, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${localStorage.token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  id: data.id,
                  content: content,
                }),
              })
                .then((res) => {
                  return res.json();
                })
                .then((result) => {
                  console.log(result);
                });
            }}
          >
            <input type="text" name="commentText" id="commentText" />
            <input type="submit" value="Send Comment" />
          </form>
        </div>
      </div>
    </>
  );
}
