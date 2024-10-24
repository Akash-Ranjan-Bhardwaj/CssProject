import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "./homepage.css";

function HomePage() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/home");
  };

  const handleAllListingsClick = () => {
    if (isLoggedIn) {
      navigate("/home/allListings"); // Navigate to all listings if logged in
    } else {
      navigate("/login"); // Redirect to login if not logged in
    }
  };

  return (
    <div className="container">
      <h1 className="title">This is the homepage</h1>
      <div className="btn-box">
        <a href="/home/form">
          <button
            type="button"
            className="btn btn-primary"
            data-mdb-ripple-init
          >
            Fill the Form
          </button>
        </a>
        <button
          type="button"
          className="btn btn-primary"
          data-mdb-ripple-init
          onClick={handleAllListingsClick} // Handle click for all listings
        >
          All Listings
        </button>

        {!isLoggedIn ? (
          <>
            <a href="/login">
              <button
                type="button"
                className="btn btn-primary"
                data-mdb-ripple-init
              >
                Login
              </button>
            </a>
            <a href="/signup">
              <button
                type="button"
                className="btn btn-secondary"
                data-mdb-ripple-init
              >
                Signup
              </button>
            </a>
          </>
        ) : (
          <>
            <button
              type="button"
              className="btn btn-warning"
              data-mdb-ripple-init
              onClick={handleLogout}
            >
              Logout
            </button>
            <a href="/protected">
              <button
                type="button"
                className="btn btn-success"
                data-mdb-ripple-init
              >
                Protected Route
              </button>
            </a>
          </>
        )}
      </div>
    </div>
  );
}

export default HomePage;
