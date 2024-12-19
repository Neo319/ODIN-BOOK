// creates a form for uploading posts, comments, etc.

// content: Object with fields to render (prop key and values are rendered)
// (fields should be objects with props: type, name, value.)

// route: the URL this form submits to.
export default function PostForm(content, route) {
  return (
    <>
      <form action="">
        {Object.keys(content).map((key) => {
          return (
            <div key={"PostForm#" + key}>
              <label htmlFor={key}>{key} :</label>
              <input type="text" defaultValue={content[key]} />
            </div>
          );
        })}
        <input
          type="submit"
          value="Submit"
          onClick={(e) => {
            e.preventDefault();
            console.log("temp: sending to ", route);
          }}
        />
      </form>
    </>
  );
}
