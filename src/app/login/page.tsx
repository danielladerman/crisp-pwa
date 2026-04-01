"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  async function handleVerifyToken(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/");
    }
  }

  return (
    <div
      className="flex min-h-dvh flex-col items-center justify-center"
      style={{ background: "#008080" }}
    >
      {/* Desktop icon row (decorative) */}
      <div className="absolute top-4 left-4 flex flex-col items-center gap-1 select-none">
        <div
          style={{
            width: 32,
            height: 32,
            background: "linear-gradient(135deg,#ddd 0%,#999 100%)",
            border: "1px solid #fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
          }}
        >
          🖥️
        </div>
        <span style={{ color: "#fff", fontSize: 11, fontFamily: "inherit", textShadow: "1px 1px 2px #000" }}>
          My Computer
        </span>
      </div>

      {/* Win2K window */}
      <div
        style={{
          width: 360,
          background: "#d4d0c8",
          border: "2px solid",
          borderColor: "#ffffff #808080 #808080 #ffffff",
          boxShadow: "2px 2px 0 #000",
          fontFamily: "'Tahoma', 'Arial', sans-serif",
          fontSize: 11,
        }}
      >
        {/* Title bar */}
        <div
          style={{
            background: "linear-gradient(90deg, #000080 0%, #1084d0 100%)",
            padding: "3px 4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            userSelect: "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {/* App icon */}
            <div
              style={{
                width: 16,
                height: 16,
                background: "#ffff00",
                border: "1px solid #808080",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
              }}
            >
              ✉
            </div>
            <span style={{ color: "#fff", fontSize: 12, fontWeight: "bold" }}>
              Crisp — Log On to Windows
            </span>
          </div>
          {/* Window controls */}
          <div style={{ display: "flex", gap: 2 }}>
            {["_", "□", "✕"].map((label) => (
              <button
                key={label}
                style={{
                  width: 16,
                  height: 14,
                  background: "#d4d0c8",
                  border: "1px solid",
                  borderColor: "#ffffff #808080 #808080 #ffffff",
                  fontSize: 9,
                  fontWeight: "bold",
                  cursor: "default",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                  color: "#000",
                }}
                tabIndex={-1}
                aria-hidden="true"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Window body */}
        <div style={{ padding: 16 }}>
          {/* Logo / banner */}
          <div
            style={{
              background: "linear-gradient(90deg, #000080 50%, #1084d0 100%)",
              padding: "8px 12px",
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ color: "#fff", fontSize: 20, fontWeight: "bold", letterSpacing: 1 }}>
                Crisp
              </div>
              <div style={{ color: "#a8d8f0", fontSize: 10 }}>Daily communication practice</div>
            </div>
            <div style={{ color: "#ffffff", fontSize: 28, opacity: 0.6 }}>🔑</div>
          </div>

          {/* Inset info box */}
          <div
            style={{
              background: "#ececec",
              border: "2px solid",
              borderColor: "#808080 #ffffff #ffffff #808080",
              padding: "6px 10px",
              marginBottom: 12,
              fontSize: 11,
              color: "#000",
              lineHeight: 1.5,
            }}
          >
            {sent ? (
              <>
                <strong>Enter the 6-digit code</strong> sent to{" "}
                <strong>{email}</strong> to complete sign-in.
              </>
            ) : (
              "Enter your e-mail address to receive a one-time sign-in code."
            )}
          </div>

          {/* Form */}
          {sent ? (
            <form onSubmit={handleVerifyToken}>
              {/* Verification code field */}
              <div style={{ marginBottom: 10 }}>
                <label
                  htmlFor="token"
                  style={{ display: "block", marginBottom: 3, color: "#000", fontWeight: "bold" }}
                >
                  Verification Code:
                </label>
                <input
                  id="token"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="000000"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  required
                  autoFocus
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    background: "#fff",
                    border: "2px solid",
                    borderColor: "#808080 #ffffff #ffffff #808080",
                    padding: "3px 6px",
                    fontSize: 14,
                    letterSpacing: 8,
                    textAlign: "center",
                    fontFamily: "'Courier New', monospace",
                    outline: "none",
                    color: "#000",
                  }}
                />
              </div>

              {/* Error */}
              {error && (
                <div
                  style={{
                    background: "#fff0f0",
                    border: "1px solid #cc0000",
                    padding: "4px 8px",
                    marginBottom: 10,
                    fontSize: 11,
                    color: "#cc0000",
                  }}
                >
                  ⚠ {error}
                </div>
              )}

              {/* Separator */}
              <div
                style={{
                  borderTop: "1px solid #808080",
                  borderBottom: "1px solid #fff",
                  margin: "12px 0",
                }}
              />

              {/* Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
                <Win2KButton
                  type="button"
                  onClick={() => { setSent(false); setToken(""); setError(""); }}
                >
                  ← Back
                </Win2KButton>
                <Win2KButton
                  type="submit"
                  disabled={loading || token.length < 6}
                  primary
                >
                  {loading ? "Verifying…" : "OK"}
                </Win2KButton>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSendCode}>
              {/* Email field */}
              <div style={{ marginBottom: 10 }}>
                <label
                  htmlFor="email"
                  style={{ display: "block", marginBottom: 3, color: "#000", fontWeight: "bold" }}
                >
                  E-mail Address:
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    background: "#fff",
                    border: "2px solid",
                    borderColor: "#808080 #ffffff #ffffff #808080",
                    padding: "3px 6px",
                    fontSize: 12,
                    fontFamily: "inherit",
                    outline: "none",
                    color: "#000",
                  }}
                />
              </div>

              {/* Error */}
              {error && (
                <div
                  style={{
                    background: "#fff0f0",
                    border: "1px solid #cc0000",
                    padding: "4px 8px",
                    marginBottom: 10,
                    fontSize: 11,
                    color: "#cc0000",
                  }}
                >
                  ⚠ {error}
                </div>
              )}

              {/* Separator */}
              <div
                style={{
                  borderTop: "1px solid #808080",
                  borderBottom: "1px solid #fff",
                  margin: "12px 0",
                }}
              />

              {/* Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
                <Win2KButton type="submit" disabled={loading} primary>
                  {loading ? "Sending…" : "Next →"}
                </Win2KButton>
                <Win2KButton type="button" disabled>
                  Cancel
                </Win2KButton>
              </div>
            </form>
          )}
        </div>

        {/* Status bar */}
        <div
          style={{
            background: "#d4d0c8",
            borderTop: "1px solid #808080",
            padding: "2px 6px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 10,
            color: "#000",
          }}
        >
          <div
            style={{
              border: "2px inset #d4d0c8",
              padding: "1px 4px",
              flex: 1,
              borderColor: "#808080 #fff #fff #808080",
            }}
          >
            {sent ? "Awaiting verification code" : "Ready"}
          </div>
        </div>
      </div>

      {/* Win2K Taskbar */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: 28,
          background: "#d4d0c8",
          borderTop: "2px solid #fff",
          display: "flex",
          alignItems: "center",
          paddingLeft: 2,
          gap: 4,
          zIndex: 50,
        }}
      >
        {/* Start button */}
        <button
          style={{
            background: "#d4d0c8",
            border: "2px solid",
            borderColor: "#ffffff #808080 #808080 #ffffff",
            padding: "2px 8px",
            fontWeight: "bold",
            fontSize: 12,
            fontFamily: "'Tahoma', sans-serif",
            display: "flex",
            alignItems: "center",
            gap: 4,
            cursor: "default",
            height: 22,
            color: "#000",
          }}
          tabIndex={-1}
          aria-label="Start"
        >
          <span style={{ fontSize: 14 }}>⊞</span> Start
        </button>

        {/* Divider */}
        <div style={{ width: 1, height: 20, background: "#808080", marginLeft: 2 }} />

        {/* Active window chip */}
        <div
          style={{
            background: "#d4d0c8",
            border: "2px inset",
            borderColor: "#808080 #fff #fff #808080",
            padding: "0 8px",
            fontSize: 11,
            height: 22,
            display: "flex",
            alignItems: "center",
            gap: 4,
            minWidth: 140,
            color: "#000",
          }}
        >
          ✉ Crisp — Log On to Windows
        </div>

        {/* Clock */}
        <div
          style={{
            marginLeft: "auto",
            marginRight: 4,
            border: "2px inset",
            borderColor: "#808080 #fff #fff #808080",
            padding: "1px 8px",
            fontSize: 11,
            height: 22,
            display: "flex",
            alignItems: "center",
            color: "#000",
          }}
        >
          {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  );
}

/* Reusable Win2K-style button */
function Win2KButton({
  children,
  type = "button",
  onClick,
  disabled,
  primary,
}: {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  primary?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        minWidth: 75,
        height: 23,
        background: disabled ? "#d4d0c8" : "#d4d0c8",
        border: "2px solid",
        borderColor: disabled
          ? "#999 #999 #999 #999"
          : "#ffffff #808080 #808080 #ffffff",
        outline: primary ? "1px solid #000" : "none",
        outlineOffset: -3,
        fontSize: 11,
        fontFamily: "'Tahoma', 'Arial', sans-serif",
        cursor: disabled ? "default" : "pointer",
        color: disabled ? "#808080" : "#000",
        padding: "0 8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
      }}
    >
      {children}
    </button>
  );
}
