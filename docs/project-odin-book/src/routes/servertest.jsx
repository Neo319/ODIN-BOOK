import { useState } from "react";

export default function ServerTest() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(true);

  const URL = import.meta.env.VITE_API_URL;

  async function runTest() {
    const res = await fetch(`${URL}/servertest`);

    if (res.body.success === true) {
      setLoading(false);
      setStatus(res.body.status);
    } else {
      setLoading(false);
      setStatus("Server error!");
    }
  }

  runTest();
  return (
    <>
      <h1>server test lives here</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <p>Server Status: {JSON.stringify(status)}</p>
      )}
    </>
  );
}
