import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-10 py-5 bg-black text-white border-b border-gray-800">
      <h1 className="text-2xl font-bold text-blue-500">
        DevFlow AI
      </h1>

      <div className="flex gap-8">
        <Link href="/">Home</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/login">Login</Link>
        <Link href="/register">Register</Link>
      </div>
    </nav>
  );
}