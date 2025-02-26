import React from "react";
import "./Footer.css";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="footer">
      <div className="footer-bottom">
        <p> {currentYear} Art Work. All rights reserved.</p>
      </div>
    </div>
  );
};
