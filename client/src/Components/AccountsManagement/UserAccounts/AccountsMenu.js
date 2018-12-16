import React from "react";
import { NavLink } from "react-router-dom";
import AddNewAccountForm from "./AddNewAccountForm";
import SearchAccountForm from "./SearchAccountForm";
import Button from "../../Elements/Button";

const AccountsMenu = () => {
  const menuContent = () => {
    return (
      <React.Fragment>
        <div className="row">
          <div className="col">
            <div className=" btn-group dropright">
              <Button
                value="New Account"
                className="btn btn-primary"
                data-toggle="collapse"
                data-target="#createAccountCollapse"
                aria-expanded="false"
                aria-controls="createAccountCollapse"
              />
              <Button
                value={<span className="sr-only" />}
                className="btn btn-default dropdown-toggle dropdown-toggle-split"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              />
              <div className="dropdown-menu">
                <h6 className="dropdown-header">Accounts Options</h6>
                <NavLink className="dropdown-item" to="!#">
                  Lock Sign Up
                </NavLink>
                <NavLink className="dropdown-item" to="!#">
                  Lock Sign In
                </NavLink>
                <div className="dropdown-divider" />
                <NavLink className="dropdown-item" to="!#">
                  All Options
                </NavLink>
              </div>
            </div>
          </div>
          <div className="col">
            <Button
              value="Search"
              data-toggle="collapse"
              data-target="#searchAccountCollapse"
              aria-expanded="false"
              aria-controls="searchAccountCollapse"
            />
          </div>
        </div>
        <div className="collapse" id="createAccountCollapse">
          <div className="card card-body">
            <AddNewAccountForm />
          </div>
        </div>
        <div className="collapse" id="searchAccountCollapse">
          <div className="card card-body">
            <SearchAccountForm />
          </div>
        </div>
      </React.Fragment>
    );
  };

  return <div className="mt-3">{menuContent()}</div>;
};

export default AccountsMenu;
