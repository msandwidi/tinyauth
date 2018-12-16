import React, { Component } from "react";
import { Form } from "informed";
import { connect } from "react-redux";
import Button from "../../Elements/Button";
import TextInput from "../../Elements/TextInput";
import LoadingSpinner from "../../LoadingSpinner";
import ConfirmationSection from "../ConfirmationSection";
import {
  resetAccountCreation,
  createNewAccount
} from "../../../store/actions/newAccount";

class AddNewAccountForm extends Component {
  renderForm() {
    const { isLoading, newUserAddedSuccess, message } = this.props;
    if (newUserAddedSuccess && !isLoading) {
      return (
        <ConfirmationSection
          message={message}
          resetHandler={this.props.resetAccountCreation}
        />
      );
    }
    if (!newUserAddedSuccess && !isLoading) {
      return (
        <React.Fragment>
          <span className="ml-1">
            <b>Create New Account</b>
          </span>
          <Form
            id="addNewAccountForm"
            onSubmit={formState => this.props.createNewAccount(formState)}
          >
            <div className="row">
              <div className="col-sm">
                <TextInput
                  name="firstname"
                  label="First Name"
                  classes="form-control mb-1"
                  required
                />
              </div>
              <div className="col-sm">
                <TextInput
                  name="lastname"
                  label="Last Name"
                  classes=" form-control mb-1"
                  required
                />
              </div>
            </div>
            <div className="row">
              <div className="col-sm">
                <TextInput
                  type="email"
                  name="email"
                  label="Email Address"
                  classes="form-control  mb-1"
                />
              </div>
              <div className="col-sm">
                <TextInput
                  name="phoneNumber"
                  label="Phone Number"
                  classes="form-control mb-1"
                />
              </div>
            </div>
          </Form>
          <Button type="submit" form="addNewAccountForm" />
        </React.Fragment>
      );
    }
    return <LoadingSpinner isLoading={isLoading} />;
  }
  render() {
    return <div>{this.renderForm()}</div>;
  }
}

const mapStateToProps = state => {
  return {
    isLoading: state.newAccount.isLoading,
    message: state.newAccount.message,
    newUserAddedSuccess: state.newAccount.newUserAddedSuccess
  };
};

export default connect(
  mapStateToProps,
  { resetAccountCreation, createNewAccount }
)(AddNewAccountForm);
