import React from "react";
import AccountsMenu from "./AccountsMenu";
import AccountsTable from "./AccountsTable";

const AccountsSection = () => {
  return (
    <div className="mt-3">
      <h5>List of Accounts</h5>
      <AccountsMenu />
      <AccountsTable />
    </div>
  );
};

export default AccountsSection;
