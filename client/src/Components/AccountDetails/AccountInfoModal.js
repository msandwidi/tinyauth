import React, { Component } from "react";
import AccountDetails from "./AccountDetails";
import Button from "../Elements/Button";
import Modal from "../Elements/Modal";
import { connect } from "react-redux";
import classnames from "classnames";
import { fetchAccountsManagement } from "../../store/actions/accountsManagement";
import { resetAccountUpdate } from "../../store/actions/updateUserAccount";

class AccountInfoModal extends Component {
  renderModalContent() {
    const { selectedUser } = this.props;
    if (selectedUser) {
      return <AccountDetails selectedUser={selectedUser} />;
    }
    return null;
  }
  renderModalFooter() {
    const { isLoading, isCompleted } = this.props;
    const cancelBtnClasses = `${classnames("btn btn-secondary", {
      disabled: isLoading
    })}`;
    return (
      <div className="mt-3 modal-footer">
        {isCompleted ? (
          <Button
            value="Done"
            data-dismiss="modal"
            className="btn btn-success"
            onClick={() => this.props.resetAccountUpdate()}
          />
        ) : (
          <React.Fragment>
            <Button
              data-dismiss="modal"
              value="Close"
              className={cancelBtnClasses}
            />
          </React.Fragment>
        )}
      </div>
    );
  }
  render() {
    return (
      <Modal id="accountInfoModal" title="Account Details" preventClose>
        {this.renderModalContent()}
        {this.renderModalFooter()}
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedUser: state.userAccountUpdate.selectedUser,
    isLoading: state.userAccountUpdate.isLoading,
    isCompleted: state.userAccountUpdate.isCompleted
  };
};

export default connect(
  mapStateToProps,
  { fetchAccountsManagement, resetAccountUpdate }
)(AccountInfoModal);
