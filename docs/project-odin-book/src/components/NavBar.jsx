// NavBar

// user: object for displaying info of logged in users.
// highlight: string denoting name of current loaded page.
export default function NavBar(user, highlight) {
  //

  //highlight is WIP
  console.log("debug from navbar - should highlght: ", highlight);

  return (
    <>
      <span>debug/temp: this is a NavBar.</span>
      <nav>
        <div className="navLinks">
          {user ? (
            <>
              <div className="navBarAvatar">
                {/* <img src="" alt="your avatar" /> */}
                <span> temp: avatar should be displayed in this div</span>
              </div>
              <h2>My Profile</h2>
              <ul>
                <li>View/Customize My Profile(wip)</li>
                <li>Followed Users(wip)</li>
                <li>My Posts(wip)</li>
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

          {/* other */}
          <ul>
            <li>Dashboard</li>
            <li>Search Posts...</li>
            <li>User Index</li>
          </ul>
        </div>
      </nav>
    </>
  );
}
