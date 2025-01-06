import { useState } from "react";
import NavBar from "../components/NavBar";

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    password2: "",
  });

  // ---- handle changes to form data  ----
  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // ---- Submitting the form data ----
  function formSubmit(data) {
    console.log("debug -- Url: ", import.meta.env.VITE_API_URL);
    console.log("debug -- Data: ", data);

    // sending the request
    fetch(`${import.meta.env.VITE_API_URL}/signup`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    })
      .then((result) => {
        return result.json();
      })
      .then((response) => {
        console.log(response);

        if (response.success === true) {
          alert(`New user ${formData.username} successfully created.`);
          // redirect to login on success
          window.location.href = "/login";
        } else {
          alert("There was an error! Try another username?");
        }
      });
  }

  return (
    <>
      {NavBar(null, "signup")}
      <div className="main">
        <h1>Hi. Signup page here.</h1>

        <h2>Create New User here.</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            formSubmit(formData);
          }}
        >
          <label htmlFor="username">Username: </label>
          <input
            required={true}
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <br />

          <label htmlFor="password">Enter Password: </label>
          <input
            required={true}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <br />

          <label htmlFor="password2">Confirm Password: </label>
          <input
            required={true}
            type="password"
            name="password2"
            value={formData.password2}
            onChange={handleChange}
          />
          <br />

          <input type="submit" value="Create User" />
        </form>
      </div>
    </>
  );
}
