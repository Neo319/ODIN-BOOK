// renders details of a user, post, etc.

import PostForm from "./PostForm";

// content: Object with fields to render (prop key and values are rendered)
// isEditable: boolean denoting whether this content should be editable.

// isEditing, setIsEditing: optional state & function recieved from parent component.
export default function Detail(
  content,
  isEditable,
  isEditing = false,
  setIsEditing = null,
  formData,
  setFormData
) {
  if (!content) return <> -- Detail component error: missing content --</>;

  return (
    <>
      <ul>
        {isEditable ? (
          <button
            onClick={() => {
              setIsEditing(true);
            }}
          >
            {!isEditing ? "Edit" : "Cancel"}
          </button>
        ) : (
          <></>
        )}
        {!isEditing
          ? // iterate through objects and render all keys and values
            Object.keys(content).map((key) => {
              return (
                <li key={"Details#" + key}>
                  {key} : {content[key]}
                </li>
              );
            })
          : PostForm(
              {
                username: content.username,
                bio: content.bio,
              },
              import.meta.env.VITE_API_URL + "/updateUser",
              formData,
              setFormData
            )}
      </ul>
    </>
  );
}
