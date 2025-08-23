"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";
import styles from "./loginForm.module.css";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("🚀 [LoginForm] Starting login process");

    try {
      const form = new FormData(e.currentTarget);
      const username = form.get("username");
      const password = form.get("password");

      console.log("🔑 [LoginForm] Calling signIn with username:", username);

      const res = await signIn("credentials", {
        redirect: false,
        username,
        password,
      });

      console.log("📦 [LoginForm] SignIn response:", res);
      console.log("✅ [LoginForm] res.ok:", res?.ok);
      console.log("❌ [LoginForm] res.error:", res?.error);
      console.log("🔗 [LoginForm] res.url:", res?.url);

      setLoading(false);

      if (res?.error) {
        console.error("❌ [LoginForm] Login failed with error:", res.error);
        setError(res.error || "Invalid credentials");
        return;
      }

      if (res?.ok) {
        console.log("🎉 [LoginForm] Login successful! Attempting redirect to dashboard");
        console.log("🌍 [LoginForm] Current location:", window.location.href);
        
        // Try different redirect approaches
        console.log("🔄 [LoginForm] Method 1: window.location.href");
        window.location.href = "/dashboard";
        
        // Fallback after 2 seconds
        setTimeout(() => {
          console.log("🔄 [LoginForm] Method 2: window.location.replace (fallback)");
          window.location.replace("/dashboard");
        }, 2000);
        
        // Another fallback after 4 seconds
        setTimeout(() => {
          console.log("🔄 [LoginForm] Method 3: Full URL redirect (fallback)");
          window.location.href = window.location.origin + "/dashboard";
        }, 4000);
      } else {
        console.warn("⚠️ [LoginForm] Login response neither ok nor error:", res);
      }
    } catch (err) {
      console.error("💥 [LoginForm] Login error:", err);
      setLoading(false);
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form} aria-live="polite">
      <h1>Login</h1>
      <input type="text" placeholder="username" name="username" required />
      <input type="password" placeholder="password" name="password" required />
      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
      {error && <div className={styles.error}>{error}</div>}
    </form>
  );
}
