import { useState, useEffect } from "react";
import "../App.css";

import NavBar from "../components/NavBar";

// display all users you have followed
export default function UserIndex() {
  const [user, setUser] = useState();
  const [data, setData] = useState(null);

  const URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // first, retrieve data to render on user index
    fetch(`${URL}/searchUsers/`)
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((result) => {
        console.log(result);
        setData(result);
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
  }, [URL]);

  return (
    <>
      {NavBar(user, "userIndex")}
      <div className="main">
        <h1>Hi. User Index page here.</h1>

        {data !== null ? (
          <>
            <h2>Users: </h2>
            <span>note: limited to 10 displayed at a time. (wip)</span>
            <ul>
              {data.result.map((user) => {
                return (
                  <li key={"index#" + user.id}>
                    <>{user.username}</>
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <>loading...</>
        )}
      </div>
    </>
  );
}
