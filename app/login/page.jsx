"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push("/");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      // Friendly error handling for the UI
      if (err.code === "auth/invalid-credential") {
        setError("Invalid email or password. Please try again.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1A1A1B] p-4 text-white font-sans">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-white/10 bg-[#252526] p-10 shadow-2xl">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto relative h-16 w-16">
            <Image
              src="/logo.png"
              alt="MF-Packages Logo"
              fill
              className="object-contain"
            />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black uppercase tracking-tight">Admin Login</h1>
            <p className="text-sm font-medium text-white/40 uppercase tracking-widest">
              MF-Packages Management Portal
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400 animate-shake">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-white/60">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mfpackages.com"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white outline-none transition-all placeholder:text-white/20 focus:border-[#E93E24] focus:ring-1 focus:ring-[#E93E24]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-white/60">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-12 text-white outline-none transition-all placeholder:text-white/20 focus:border-[#E93E24] focus:ring-1 focus:ring-[#E93E24]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <button
            disabled={isSubmitting}
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E93E24] py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-[#E93E24]/20 transition-all hover:bg-[#d1351f] active:scale-95 disabled:opacity-50 disabled:grayscale"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Validating...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-center text-[10px] font-medium uppercase tracking-[0.2em] text-white/20">
          Secure Access Only • Powered by Antigravity
        </p>
      </div>
    </div>
  );
}
