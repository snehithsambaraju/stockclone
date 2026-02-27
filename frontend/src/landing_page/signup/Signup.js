import React, { useState } from "react";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3002";

function Signup() {
  const [mode, setMode] = useState("signup"); // "signup" | "login"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("authUser") || "null") // persist simple login state
  );

  const resetMessages = () => {
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetMessages();

    try {
      setLoading(true);

      const endpoint =
        mode === "signup"
          ? `${API_BASE_URL}/api/auth/signup`
          : `${API_BASE_URL}/api/auth/login`;

      const body =
        mode === "signup" ? { name, email, password } : { email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      if (mode === "signup") {
        setMessage("Signup successful. You can now log in.");
        setMode("login");
        setPassword("");
      } else {
        setMessage("Login successful.");
        setUser(data.user || null);
        localStorage.setItem("authUser", JSON.stringify(data.user || null));

        // Redirect to dashboard app after successful login
        window.location.href = "http://localhost:3000";
      }
    } catch (err) {
      console.error(err);
      setError("Unable to reach server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    resetMessages();
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setUser(null);
      localStorage.removeItem("authUser");
      setMessage("Logged out.");
    }
  };

  const isSignup = mode === "signup";

  return (
    <div className="container my-5" style={{ maxWidth: "480px" }}>
      <h2 className="mb-4 text-center">
        {user ? "Account" : isSignup ? "Create an account" : "Log in"}
      </h2>

      {user ? (
        <div className="card p-4 shadow-sm">
          <p className="mb-2">
            <strong>Name:</strong> {user.name}
          </p>
          <p className="mb-4">
            <strong>Email:</strong> {user.email}
          </p>
          <button
            type="button"
            className="btn btn-danger w-100"
            onClick={handleLogout}
          >
            Log out
          </button>
        </div>
      ) : (
        <div className="card p-4 shadow-sm">
          <div className="btn-group mb-4 w-100" role="group">
            <button
              type="button"
              className={`btn ${
                isSignup ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => {
                resetMessages();
                setMode("signup");
              }}
            >
              Signup
            </button>
            <button
              type="button"
              className={`btn ${
                !isSignup ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => {
                resetMessages();
                setMode("login");
              }}
            >
              Login
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {isSignup && (
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isSignup}
                />
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="alert alert-danger py-2" role="alert">
                {error}
              </div>
            )}
            {message && !error && (
              <div className="alert alert-success py-2" role="alert">
                {message}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-100 mt-2"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : isSignup
                ? "Create account"
                : "Log in"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Signup;


