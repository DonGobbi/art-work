import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useData } from "../../contexts/DataProvider.js";
import { useAuth } from "../../contexts/AuthProvider.js";

import "./UserProfile.css";

export const UserProfile = () => {
  const { loading } = useData();
  const { currentPage, setCurrentPage } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Update current page based on the URL path
    const path = location.pathname;
    if (path === "/profile") {
      setCurrentPage("profile");
    } else if (path === "/profile/orders") {
      setCurrentPage("orders");
    } else if (path === "/profile/addresses") {
      setCurrentPage("addresses");
    }
  }, [location.pathname, setCurrentPage]);

  return (
    !loading && (
      <div>
        <div className="user-profile-container">
          <div className="link-container">
            <Link
              style={{ color: currentPage === "profile" ? "black" : "grey" }}
              onClick={() => setCurrentPage("profile")}
              to="/profile"
            >
              Profile
            </Link>
            <Link
              style={{ color: currentPage === "orders" ? "black" : "grey" }}
              onClick={() => setCurrentPage("orders")}
              to="/profile/orders"
            >
              Orders
            </Link>
            <Link
              style={{ color: currentPage === "addresses" ? "black" : "grey" }}
              onClick={() => setCurrentPage("addresses")}
              to="/profile/addresses"
            >
              Addresses
            </Link>
          </div>
          <Outlet />
        </div>
      </div>
    )
  );
};
