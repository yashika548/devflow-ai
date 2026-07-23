"use client";

import { useState } from "react";
import { loginUser } from "@/services/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
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
      console.log("Button Clicked");

      const res = await loginUser(form);

      console.log("Response:", res);

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      console.log("User Saved:", localStorage.getItem("user"));

      alert("Login Successful");

      router.push("/chat");
    } catch (err: any) {
      console.log(err);
      alert("Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md bg-zinc-900 p-8 rounded-xl text-white">

        <h1 className="text-3xl font-bold mb-6">
          Login
        </h1>

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 rounded bg-zinc-800 mb-4"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 rounded bg-zinc-800 mb-6"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 py-3 rounded"
        >
          Login
        </button>

      </div>
    </div>
  );
}