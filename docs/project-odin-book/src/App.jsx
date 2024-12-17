import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const URL = import.meta.env.VITE_API_URL;
    fetch(`${URL}/searchPosts/`).then((res) => {
      console.log(res);
      res.json().then((data) => {
        console.log("debug-setting posts to: ", data);
        setPosts(data);
      });
    });
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Project Odin Book</h1>
      {/* Project info section: */}
      <div className="infoDiv">
        <h2>Description</h2>
        <p>
          This project integrates back- and front-end development to create a
          social media app, incliding users with login credentials, profiles and
          photos; posts with text only (images etc are WIP); and the ability to
          like posts, add comments to them, and follow users.
        </p>

        <ul>
          <li>Faker.js used to seed database</li>
          <li>
            <a
              href="https://railway.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Railway{" "}
            </a>
            used for backend deployment
          </li>
        </ul>
      </div>
      {/* temporary links  */}
      <h2>vvv Links for development vvv</h2>
      <ul>
        <li>
          <a href="/servertest">Server Test</a>
        </li>
      </ul>
      <br />
      information for dashboard:
      <span>{JSON.stringify(posts)}</span>
    </>
  );
}

export default App;
