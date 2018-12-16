import './Header.css'
import React from "react";

const PageHeader = () => {
  return (
    <div className="top-header container">
      <h3>Page Header</h3>
      <div className="row">
        <div className="col">
          <h6>Subbrand</h6>
        </div>
        <div className="col">
          <div className="float-right">
            <h6>Username</h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
