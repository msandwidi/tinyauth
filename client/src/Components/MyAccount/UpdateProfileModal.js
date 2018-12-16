import React, { Component } from "react";
import classnames from "classnames";
import Button from "../Elements/Button";
import Modal from "../Elements/Modal";
import { connect } from "react-redux";
import UpdateProfileForm from "./UpdateProfileForm";
import ConfirmationPage from "./ConfirmationPage";
import LoadingSpinner from "../LoadingSpinner";
import { resetUpdate } from "../../store/actions/updateMyProfile";

class UpdateProfileModal extends Component {
  formContent() {
    const {
      user,
      loadingUser,
      userUpdateSuccess,
      message,
      loadingAccountUpdate
    } = this.props;
    const isLoading = loadingAccountUpdate || loadingUser;
    if (user && !loadingUser && !loadingAccountUpdate && userUpdateSuccess) {
      return <ConfirmationPage message={message} />;
    }
    if (user && !loadingUser && !loadingAccountUpdate && !userUpdateSuccess) {
      return (
        <UpdateProfileForm
          user={user}
          updateProfileHandler={this.props.updateProfileHandler}
        />
      );
    }
    return <LoadingSpinner loading={isLoading} />;
  }

  modalFooter() {
    const { loadingAccountUpdate, userUpdateSuccess } = this.props;
    const cancelBtnClasses = `${classnames("btn btn-secondary", {
      disabled: loadingAccountUpdate
    })}`;
    const submitBtnClasses = `${classnames("btn btn-primary", {
      invisible: loadingAccountUpdate
    })}`;
    return (
      <div className="mt-3 modal-footer">
        {userUpdateSuccess ? (
          <Button
            value="Close"
            data-dismiss="modal"
            className="btn btn-secondary"
            onClick={() =>
              setTimeout(() => {
                return this.props.resetUpdate();
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
              form="updateProfileForm"
              className={submitBtnClasses}
            />
          </React.Fragment>
        )}
      </div>
    );
  }

  renderModalContent() {
    return (
      <Modal id="updateProfile" title="Update Profile" preventClose>
        {this.formContent()}
        {this.modalFooter()}
      </Modal>
    );
  }

  render() {
    return this.renderModalContent();
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    message: state.myProfileUpdate.message,
    userUpdateSuccess: state.myProfileUpdate.userUpdateSuccess,
    loadingAccountUpdate: state.myProfileUpdate.isLoading,
    loadingUser: state.auth.isLoading
  };
};

export default connect(
  mapStateToProps,
  { resetUpdate }
)(UpdateProfileModal);
