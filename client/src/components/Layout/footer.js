import React from "react";
import { Link } from "react-router-dom";

const footer = () => {
  return (
    <div className="bg-dark text-light py-4 footer">
      <div className="container">
        <p className="d-flex justify-content-center align-items-center text-muted">
          Footer © copyright
        </p>
      </div>
    </div>
  );
};

export default footer;
