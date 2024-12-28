export default function Logout() {
  setTimeout(() => {
    localStorage.clear();
    window.location.href = "/";
  }, 5000);
  return <>You have logged out successfully. Redirecting to Dashboard...</>;
}
