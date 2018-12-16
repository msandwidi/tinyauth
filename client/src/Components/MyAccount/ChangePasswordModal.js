import React, { Component } from "react";
import classnames from "classnames";
import { connect } from "react-redux";
import Button from "../Elements/Button";
import Modal from "../Elements/Modal";
import ChangePasswordForm from "./ChangePasswordForm";
import ConfirmationPage from "./ConfirmationPage";
import LoadingSpinner from "../LoadingSpinner";
import { resetUpdate } from "../../store/actions/updateMyProfile";
import { setTimeout } from "timers";

class ChangePasswordModal extends Component {
  formContent() {
    const {
      user,
      message,
      loadingUser,
      loadingAccountUpdate,
      passwordUpdateSuccess
    } = this.props;
    const isLoading = loadingUser || loadingAccountUpdate;
    if (
      user &&
      !loadingUser &&
      !loadingAccountUpdate &&
      passwordUpdateSuccess
    ) {
      return <ConfirmationPage message={message} />;
    }
    if (
      user &&
      !loadingUser &&
      !loadingAccountUpdate &&
      !passwordUpdateSuccess
    ) {
      return (
        <ChangePasswordForm
          id="changePasswordForm"
          changePasswordHandler={this.props.changePasswordHandler}
        />
      );
    }
    return <LoadingSpinner loading={isLoading} />;
  }

  modalFooter() {
    const { passwordUpdateSuccess, loadingUser } = this.props;
    const cancelBtnClasses = `${classnames("btn btn-secondary", {
      disabled: loadingUser
    })}`;
    const submitBtnClasses = `${classnames("btn btn-primary", {
      invisible: loadingUser
    })}`;
    return (
      <div className="modal-footer">
        {passwordUpdateSuccess ? (
          <Button
            value="Close"
            data-dismiss="modal"
            className="btn btn-secondary"
            onClick={() =>
              setTimeout(() => {
                this.props.resetUpdate();
              }, 500)
            }
          />
        ) : (
          <React.Fragment>
            <Button
              data-dismiss="modal"
              value="Cancel"
              className={cancelBtnClasses}
            />
            <Button
              type="submit"
              value="Save"
              form="changePasswordForm"
              className={submitBtnClasses}
            />
          </React.Fragment>
        )}
      </div>
    );
  }

  renderModal = () => {
    return (
      <Modal id="changePassword" title="Change Password" preventClose>
        {this.formContent()}
        {this.modalFooter()}
      </Modal>
    );
  };
  render() {
    return this.renderModal();
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    message: state.myProfileUpdate.message,
    passwordUpdateSuccess: state.myProfileUpdate.passwordUpdateSuccess,
    loadingAccountUpdate: state.myProfileUpdate.isLoading,
    loadingUser: state.auth.isLoading
  };
};

export default connect(
  mapStateToProps,
  { resetUpdate }
)(ChangePasswordModal);
