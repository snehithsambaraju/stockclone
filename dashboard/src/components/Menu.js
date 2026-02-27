import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3002";

const Menu = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authUser, setAuthUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("authUser") || "null");
    } catch {
      return null;
    }
  });
  const location = useLocation();

  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  const isActive = (path) => location.pathname === path;

  const toggleProfile = () => {
    setIsProfileDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleStorage = () => {
      try {
        setAuthUser(JSON.parse(localStorage.getItem("authUser") || "null"));
      } catch {
        setAuthUser(null);
      }
    };
    const handleAuthUpdated = () => handleStorage();

    window.addEventListener("storage", handleStorage);
    window.addEventListener("auth-user-updated", handleAuthUpdated);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("auth-user-updated", handleAuthUpdated);
    };
  }, []);

  const displayName = authUser?.name || authUser?.email || "Guest";
  const avatarText = useMemo(() => {
    const seed = (authUser?.name || authUser?.email || "GU").trim();
    const parts = seed.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return seed.slice(0, 2).toUpperCase();
  }, [authUser]);

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      localStorage.removeItem("authUser");
      setAuthUser(null);
      setEmail("");
      setPassword("");
      setAuthError("");
      setIsProfileDropdownOpen(false);
      window.dispatchEvent(new Event("auth-user-updated"));
      window.location.href = "http://localhost:3001/signup";
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError("");

    if (!email || !password) {
      setAuthError("Email and password are required.");
      return;
    }

    try {
      setAuthLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setAuthError(data.message || "Invalid credentials");
        return;
      }

      localStorage.setItem("authUser", JSON.stringify(data.user || null));
      setAuthUser(data.user || null);
      setPassword("");
      window.dispatchEvent(new Event("auth-user-updated"));
    } catch (error) {
      console.error("Login request failed:", error);
      setAuthError("Unable to login right now.");
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="menu-container">
      {/* Logo */}
      <img
        src="logo.png"
        alt="Stock Dashboard logo"
        style={{ width: "50px", marginBottom: "20px" }}
      />

      <div className="menus">
        <ul>
          <li>
            <Link to="/" style={{ textDecoration: "none" }}>
              <p className={isActive("/") ? activeMenuClass : menuClass}>
                Dashboard
              </p>
            </Link>
          </li>

          <li>
            <Link to="/orders" style={{ textDecoration: "none" }}>
              <p className={isActive("/orders") ? activeMenuClass : menuClass}>
                Orders
              </p>
            </Link>
          </li>

          <li>
            <Link to="/holdings" style={{ textDecoration: "none" }}>
              <p className={isActive("/holdings") ? activeMenuClass : menuClass}>
                Holdings
              </p>
            </Link>
          </li>

          <li>
            <Link to="/positions" style={{ textDecoration: "none" }}>
              <p className={isActive("/positions") ? activeMenuClass : menuClass}>
                Positions
              </p>
            </Link>
          </li>

          <li>
            <Link to="/funds" style={{ textDecoration: "none" }}>
              <p className={isActive("/funds") ? activeMenuClass : menuClass}>
                Funds
              </p>
            </Link>
          </li>

          <li>
            <Link to="/apps" style={{ textDecoration: "none" }}>
              <p className={isActive("/apps") ? activeMenuClass : menuClass}>
                Apps
              </p>
            </Link>
          </li>

          <li>
            <Link to="/predictions" style={{ textDecoration: "none" }}>
              <p
                className={
                  isActive("/predictions") ? activeMenuClass : menuClass
                }
              >
                Predictions
              </p>
            </Link>
          </li>
        </ul>

        <hr />

        {/* Profile */}
        <div className="profile" onClick={toggleProfile}>
          <div className="avatar">{avatarText}</div>
          <p className="username">{displayName}</p>
        </div>

        {/* Dropdown (optional) */}
        {isProfileDropdownOpen && (
          <div className="profile-dropdown">
            {authUser ? (
              <>
                <p>{authUser.email}</p>
                <p onClick={handleLogout}>Logout</p>
              </>
            ) : (
              <form className="profile-auth-form" onSubmit={handleLogin}>
                <input
                  className="profile-input"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  className="profile-input"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {authError ? <p className="profile-error">{authError}</p> : null}
                <button className="profile-action-btn" type="submit" disabled={authLoading}>
                  {authLoading ? "Signing in..." : "Login"}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
