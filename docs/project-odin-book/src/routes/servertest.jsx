import { useState } from "react";

export default function ServerTest() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(true);

  const URL = import.meta.env.VITE_API_URL;

  async function runTest() {
    fetch(URL + "/servertest")
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((res) => {
        console.log(res);

        if (res.success === true) {
          setLoading(false);
          setStatus(res.status);
        } else {
          console.log(res);
          setLoading(false);
          setStatus("Server error!");
        }
      });
  }

  function redirect() {
    window.location.href = "/";
  }

  runTest();
  return (
    <>
      <h1>server test lives here</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <p>
          Server Status: {status}
          <br />
          You will now be redirected to the app. (temp: implement timer?)
          {setTimeout(() => {
            redirect();
          }, 5000)}
        </p>
      )}
    </>
  );
}
