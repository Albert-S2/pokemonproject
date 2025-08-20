import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-3xl text-center">
        My Pokedex
        <br />
        <Link href="/about/choosegame">
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer">
            Welcome
          </button>
        </Link>
      </h1>
    </div>
  );
}
