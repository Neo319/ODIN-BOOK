// NavBar

// user: object for displaying info of logged in users.
// highlight: string denoting name of current loaded page.
export default function NavBar(user, highlight) {
  //

  //highlight is WIP
  console.log("debug from navbar - should highlght: ", highlight);

  return (
    <>
      <nav>
        <div className="navLinks">
          {user ? (
            <>
              <div>
                <img
                  className="navBarAvatar"
                  src={
                    user.avatarURL == undefined
                      ? import.meta.env.VITE_DEFAULT_AVATAR_URL
                      : user.avatarURL
                  }
                  alt="avatar"
                />
              </div>
              <h2>My Profile</h2>
              <ul>
                <li>
                  <a href={`/myProfile/${user.username}`}>
                    View/Customize My Profile(wip)
                  </a>
                </li>
                <li>
                  <a href="/follows">Followed Users(wip)</a>
                </li>
                <li>
                  <a href="/myPosts">My Posts(wip)</a>
                </li>
                <li>
                  <a href="/logout">Log Out (only if logged in...)</a>
                </li>
              </ul>
            </>
          ) : (
            <>
              <h2>Logging in</h2>
              <ul>
                <li>
                  <a href="/servertest">Server Test</a>
                </li>
                <li>
                  <a href="/signup">Sign Up</a>
                </li>
                <li>
                  <a href="/login">Log In</a>
                </li>
              </ul>
            </>
          )}

          <h2>Other</h2>
          <ul>
            <li>
              <a href="/">Dashboard</a>
            </li>
            <li>
              <a href="/searchPosts">Search Posts...</a>
            </li>
            <li>
              <a href="/userIndex">User Index</a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
