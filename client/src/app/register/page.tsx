"use client";

import { useState } from "react";
import { registerUser } from "@/services/auth";

export default function RegisterPage() {
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
      const res = await registerUser(form);
      alert(res.message || "Registration Successful");
    } catch (err: any) {
  console.log(err);
  console.log(err.response);

  alert(err.response?.data?.message || err.message);
}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-[400px] bg-zinc-900 p-8 rounded-xl">

        <h1 className="text-3xl font-bold mb-6">
          Register
        </h1>

        <input
          name="name"
          placeholder="Name"
          className="w-full p-3 rounded bg-zinc-800 mb-4"
          onChange={handleChange}
        />

        <input
          name="email"
          placeholder="Email"
          className="w-full p-3 rounded bg-zinc-800 mb-4"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-3 rounded bg-zinc-800 mb-6"
          onChange={handleChange}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 py-3 rounded"
        >
          Register
        </button>

      </div>
    </div>
  );
}