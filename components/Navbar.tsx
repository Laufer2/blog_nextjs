import Link from "next/link";

export default function Navbar() {
  const user = null,
    username = null;

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/">
            <button>Home</button>
          </Link>
        </li>

        <li>
          {username && (
            <>
              <li className="push-left">
                <Link href="/admin">
                  <button className="btn-blue">Write Posts</button>
                </Link>
              </li>

              <li>
                <Link href={`/${username}`}>
                  <img src={user?.photoURL} alt="user photo" />
                </Link>
              </li>
            </>
          )}
          {!username && (
            <>
              <li>
                <Link href="/enter">
                  <button className="btn-blue">Login</button>
                </Link>
              </li>
            </>
          )}
        </li>
      </ul>
    </nav>
  );
}
