"use client";

import { useState } from "react";
import { registerUser } from "@/services/auth";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function RegisterPage() {

  const router = useRouter();
const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
  try {
    setLoading(true);

    await registerUser(form);

    toast.success("Account Created Successfully 🎉");

    setTimeout(() => {
      router.push("/login");
    }, 1000);

  } catch (err: any) {
    console.log(err);

    toast.error(
      err.response?.data?.message || "Registration Failed"
    );
  } finally {
    setLoading(false);
  }
};

 return (
  <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-blue-950 flex items-center justify-center px-4">

    <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">

      <div className="text-center mb-8">

        <div className="text-6xl mb-3">
          🚀
        </div>

        <h1 className="text-4xl font-bold text-white">
          Create Account
        </h1>

        <p className="text-gray-300 mt-3">
          Join DevFlow AI Today
        </p>

      </div>

      <input
        name="name"
        placeholder="👤 Full Name"
        value={form.name}
        onChange={handleChange}
        className="w-full p-4 rounded-xl bg-zinc-900 text-white border border-zinc-700 outline-none mb-4 focus:border-blue-500 transition-all"
      />

      <input
        name="email"
        type="email"
        placeholder="📧 Email"
        value={form.email}
        onChange={handleChange}
        className="w-full p-4 rounded-xl bg-zinc-900 text-white border border-zinc-700 outline-none mb-4 focus:border-blue-500 transition-all"
      />

      <input
        type="password"
        name="password"
        placeholder="🔒 Password"
        value={form.password}
        onChange={handleChange}
        className="w-full p-4 rounded-xl bg-zinc-900 text-white border border-zinc-700 outline-none mb-6 focus:border-blue-500 transition-all"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-4 rounded-xl font-semibold text-white hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50"
      >
        {loading ? "Creating Account..." : "🚀 Register"}
      </button>

      <p className="text-center text-gray-400 mt-6">
        Already have an account?
      </p>

      <button
        onClick={() => router.push("/login")}
        className="w-full mt-3 border border-zinc-700 py-3 rounded-xl hover:bg-zinc-800 transition-all text-white"
      >
        Login
      </button>

    </div>
  </div>
);
}