import Link from "next/link";

export default function Custom404() {
  return (
    <main>
      <h1>404 - That page does not seem to exist...</h1>

      <iframe
        src="https://media.tenor.com/IHdlTRsmcS4AAAAC/404.gif"
        width="580"
        height="562"
        frameBorder="0"
        allowFullScreen
      ></iframe>
      <Link href="/">
        <button className="btn-blue">Go home</button>
      </Link>
    </main>
  );
}
