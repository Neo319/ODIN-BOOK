// renders details of a user, post, etc.

// content: Object with fields to render (prop key and values are rendered)
// isEditable: boolean denoting whether this content should be editable.
// (adds button that sends user to form for updates.)
export default function Detail(content, isEditable) {
  if (!content) return <> -- Detail component error: missing content --</>;

  return (
    <>
      <ul>
        {isEditable ? <button>Edit(wip)</button> : <></>}
        {
          // iterate through objects and render all keys and values
          Object.keys(content).map((key) => {
            return (
              <li key={"Details#" + key}>
                {key} : {content[key]}
              </li>
            );
          })
        }
      </ul>
    </>
  );
}
