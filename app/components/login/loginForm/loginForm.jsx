"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./loginForm.module.css";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

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
        
        // Wait a moment for session to be established, then redirect
        console.log("⏰ [LoginForm] Waiting 500ms for session establishment");
        setTimeout(() => {
          console.log("🔄 [LoginForm] Method 1: router.push");
          router.push("/dashboard");
          
          // Fallback with router.replace after 1.5 seconds
          setTimeout(() => {
            console.log("🔄 [LoginForm] Method 2: router.replace (fallback)");
            router.replace("/dashboard");
            
            // Final fallback with window.location after 3 seconds
            setTimeout(() => {
              console.log("🔄 [LoginForm] Method 3: window.location.href (final fallback)");
              window.location.href = "/dashboard";
            }, 3500);
          }, 5500);
        }, 2000);
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
