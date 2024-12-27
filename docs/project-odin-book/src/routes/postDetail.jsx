import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import NavBar from "../components/NavBar";

export default function PostDetail() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);

  const URL = import.meta.env.VITE_API_URL;
  const params = useParams();

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
    fetch(`${URL}/post/${encodeURIComponent(params.id)}`)
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((postData) => {
        console.log(postData);
        setData(postData);
      });
  }, [URL, params]);

  console.log(params.id);
  console.log("debug - data :", data);
  return (
    <>
      {NavBar(user, null)}
      <div className="main">
        <h1>Hi. Post Detail page here.</h1>
        <span>{JSON.stringify(data)}</span>
      </div>
    </>
  );
}
