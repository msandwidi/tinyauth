import React, { Component } from "react";
import moment from "moment";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import AccountInfoModal from "../../AccountDetails";
import { setSelectedUser } from "../../../store/actions/updateUserAccount";

class AccountsTable extends Component {
  getAccountStatus(account) {
    const { isVerified, isClosed, isBlocked } = account;
    if (isClosed) {
      return "Closed";
    } else if (isBlocked) {
      return "Blocked";
    } else if (isVerified) {
      return "Active";
    } else return "Inactivated";
  }
  tableList(accountsList) {
    return accountsList.map(account => (
      <tr
        key={account._id}
        className="pointer-cursor-on-hover"
        data-toggle="modal"
        data-target="#accountInfoModal"
        onClick={() => this.props.setSelectedUser(account)}
      >
        <td>
          {account.firstname} {account.lastname}
        </td>
        <td>{account.email}</td>
        <td>{account.phoneNumber}</td>
        <td>{account.isAdmin ? "Admin" : "Standard"}</td>
        <td>{moment(account.createdAt).format("MM/DD/YYYY h:mm:ss a")}</td>
        <td>{this.getAccountStatus(account)}</td>
      </tr>
    ));
  }

  renderActivities() {
    const { accountsList } = this.props;
    if (!accountsList || accountsList.length === 0) {
      return <div>No account to show</div>;
    }
    return (
      <div className="table-responsive">
        <table className="table table-sm table-hover">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Email Address</th>
              <th scope="col">Phone #</th>
              <th scope="col">Type</th>
              <th scope="col">Creation Date</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>{this.tableList(accountsList)}</tbody>
        </table>
        <AccountInfoModal />
      </div>
    );
  }
  render() {
    return this.renderActivities();
  }
}

const mapStateToProps = state => {
  return {
    accountsList: state.accountsManagement.accountsList
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    { setSelectedUser }
  )(AccountsTable)
);
