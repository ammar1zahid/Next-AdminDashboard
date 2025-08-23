"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
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
        console.log("🎉 [LoginForm] Login successful! Verifying session before redirect");
        console.log("🌍 [LoginForm] Current location:", window.location.href);
        
        // Verify session is established before redirecting
        const verifySessionAndRedirect = async (attempt = 1) => {
          console.log(`🔍 [LoginForm] Checking session (attempt ${attempt})`);
          
          try {
            const session = await getSession();
            console.log("👤 [LoginForm] Session check result:", session ? "EXISTS" : "NULL");
            console.log("👤 [LoginForm] Session details:", {
              username: session?.user?.username,
              isAdmin: session?.user?.isAdmin
            });
            
            if (session?.user) {
              console.log("✅ [LoginForm] Session verified! Trying multiple redirect methods");
              
              // Try multiple redirect methods immediately
              console.log("🔄 [LoginForm] Method 1: window.location.assign");
              window.location.assign("/dashboard");
              
              // Immediate fallback
              setTimeout(() => {
                console.log("🔄 [LoginForm] Method 2: window.location.replace");
                window.location.replace("/dashboard");
              }, 100);
              
              // Another immediate fallback
              setTimeout(() => {
                console.log("🔄 [LoginForm] Method 3: window.location.href");
                window.location.href = "/dashboard";
              }, 200);
              
              // Router methods as fallback
              setTimeout(() => {
                console.log("🔄 [LoginForm] Method 4: router.push");
                router.push("/dashboard");
              }, 300);
              
              setTimeout(() => {
                console.log("🔄 [LoginForm] Method 5: router.replace");
                router.replace("/dashboard");
              }, 400);
              
              return;
            }
            
            // If no session and we haven't tried too many times, try again
            if (attempt < 5) {
              console.log(`⏰ [LoginForm] No session yet, retrying in ${attempt}00ms (attempt ${attempt + 1})`);
              setTimeout(() => verifySessionAndRedirect(attempt + 1), attempt * 1000);
            } else {
              console.error("❌ [LoginForm] Session verification failed after 5 attempts");
              setError("Login successful but session not established. Please refresh the page.");
            }
          } catch (sessionError) {
            console.error("💥 [LoginForm] Session check error:", sessionError);
            if (attempt < 3) {
              setTimeout(() => verifySessionAndRedirect(attempt + 1), 1000);
            } else {
              // Fallback to direct redirect if session check keeps failing
              console.log("🔄 [LoginForm] Session check failed, attempting direct redirect");
              window.location.href = "/dashboard";
            }
          }
        };
        
        // Start session verification
        verifySessionAndRedirect();
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
