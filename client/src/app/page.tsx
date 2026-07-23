import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-black text-white flex flex-col justify-center items-center">

        <h1 className="text-7xl font-bold">
          DevFlow AI 🚀
        </h1>

        <p className="mt-6 text-xl text-gray-400">
          AI Powered Coding Assistant for Developers
        </p>

        <button className="mt-10 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 transition">
          Get Started
        </button>

      </main>

      <Footer />
    </>
  );
}