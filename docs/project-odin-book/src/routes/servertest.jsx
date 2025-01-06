import { useState } from "react";
import NavBar from "../components/NavBar";

export default function ServerTest() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(true);

  const URL = import.meta.env.VITE_API_URL;

  async function runTest() {
    fetch(URL + "/servertest")
      .then((res) => {
        try {
          console.log(res);
          return res.json();
        } catch (err) {
          failureCallback(err);
        }
      })
      .then((res) => {
        console.log(res);

        if (res.success === true) {
          setLoading(false);
          setStatus(res.status);
        } else {
          failureCallback();
        }
      })
      .catch((err) => {
        failureCallback(err);
      });

    function failureCallback(err) {
      if (err) {
        console.log(err.message);
        setStatus("server error -- " + err.message);
      } else {
        setStatus("server error.");
      }
      setLoading(false);
    }
  }

  function redirect() {
    window.location.href = "/";
  }

  runTest();
  return (
    <>
      {NavBar(null, "serverTest")}
      <div className="main">
        <h1>server test lives here</h1>
        {loading ? <p>Loading...</p> : <p>Server Status: {status}</p>}
        {status === "ok" ? (
          <p>
            You will now be redirected to the app. (temp: implement timer?)
            {setTimeout(() => {
              redirect();
            }, 5000)}
          </p>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
