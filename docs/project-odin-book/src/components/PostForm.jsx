// creates a form for uploading posts, comments, etc.

// content: Object with fields to render (prop key and values are rendered)
// (fields should be objects with props: type, name, value.)

// route: the URL this form submits to.
// formData, setFormData -- state inherited from parent components.
export default function PostForm(content, route, formData, setFormData) {
  function handleChange(e) {
    const oldData = formData || content;

    const newData = { ...oldData, [e.target.name]: e.target.value };
    setFormData(newData);
  }

  return (
    <>
      <form action="">
        {Object.keys(content).map((key) => {
          return (
            <div key={"PostForm#" + key}>
              <label htmlFor={key}>{key} :</label>
              <input
                name={key}
                type="text"
                defaultValue={content[key]}
                onInput={(e) => {
                  handleChange(e);
                }}
              />
            </div>
          );
        })}
        <input
          type="submit"
          value="Submit"
          onClick={async (e) => {
            e.preventDefault();

            if (!formData) return alert("missing data: nothing to update.");

            const updatedUser = {
              username: formData.username,
              bio: formData.bio,
            };

            await fetch(route, {
              method: "POST",
              body: JSON.stringify(updatedUser),
              headers: {
                Authorization: `Bearer ${localStorage.token}`,
                "Content-Type": "application/json", // Indicate JSON data
              },
            }).then((res) => {
              console.log(res);

              if (res.ok) {
                console.log("debug: update jwt here.");
                // temp: require new login
                alert("user changed successfully. Login with new credentials.");
                localStorage.clear("token");
                window.location.href = "/login";
              }
            });
          }}
        />
      </form>
    </>
  );
}
