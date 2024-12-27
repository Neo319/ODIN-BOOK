// Post-Card : component for rendering listed posts in dashboard, search, etc.

// content: object containing:
// - id (for key)
// - creator
// - text to render
// - text cutoff (number denoting point to end displayed text)
// - avatar
export default function PostCard(content) {
  if (typeof content !== "object") {
    console.error("no content object found in PostCard");
    return <></>;
  }

  return (
    <a href={`postDetail/${content.id}`}>
      <div className="PostCard">
        <img src={content.creator.avatarURL} alt="avatar" width="40px" />
        <div>
          <b>{content.creator.username}:</b>
          <br />
          {content.content}
        </div>
      </div>
    </a>
  );
}
