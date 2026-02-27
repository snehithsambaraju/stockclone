import React, { useEffect, useState } from "react";

const Summary = () => {
  const [authUser, setAuthUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("authUser") || "null");
    } catch {
      return null;
    }
  });

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

  const greetingName = authUser?.name || authUser?.email || "User";

  return (
    <>
      <div className="username">
        <h6>Hi, {greetingName}!</h6>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Equity</p>
        </span>

        <div className="data">
          <div className="first">
            <h3>3.74k</h3>
            <p>Margin available</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Margins used <span>0</span>{" "}
            </p>
            <p>
              Opening balance <span>3.74k</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Holdings (13)</p>
        </span>

        <div className="data">
          <div className="first">
            <h3 className="profit">
              1.55k <small>+5.20%</small>{" "}
            </h3>
            <p>P&L</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Current Value <span>31.43k</span>{" "}
            </p>
            <p>
              Investment <span>29.88k</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>
    </>
  );
};

export default Summary;
