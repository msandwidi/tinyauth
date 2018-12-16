import React, { Component } from "react";
import { Form } from "informed";
import { connect } from "react-redux";
import Button from "../../Elements/Button";
import TextInput from "../../Elements/TextInput";
import { resetAccountCreation } from "../../../store/actions/newAccount";
import { searchAccount, resetAccountSearch } from "../../../store/actions/accountsManagement";

class SearchAccountForm extends Component {
  renderForm() {
    const { accountsManagement } = this.props;
    return (
      <React.Fragment>
        <span className="ml-1">
          <b>Find Account</b>
          (s)
        </span>
        <Form id="searchAccountForm">
          {({ formState }) => (
            <div className="row">
              <div className="col-sm">
                <TextInput
                  type="email"
                  name="email"
                  label="Email Address"
                  classes=" form-control mb-1"
                  onChange={() =>
                    this.props.searchAccount(
                      formState.values,
                      accountsManagement
                    )
                  }
                />
              </div>
              <div className="col-sm">
                <TextInput
                  name="phoneNumber"
                  label="Phone Number"
                  classes=" form-control mb-1"
                  onChange={() =>
                    this.props.searchAccount(
                      formState.values,
                      accountsManagement
                    )
                  }
                />
              </div>
              <div className="col-sm">
                <TextInput
                  name="name"
                  label="Name"
                  classes="form-control mb-1"
                  onChange={() =>
                    this.props.searchAccount(
                      formState.values,
                      accountsManagement
                    )
                  }
                />
              </div>
              <div className="col-sm">
                <Button
                  type="submit"
                  onClick={() =>
                    this.props.searchAccount(
                      formState.values,
                      accountsManagement
                    )
                  }
                />
                <Button
                  className="btn btn-default ml-2"
                  type="reset"
                  value="Clear"
                  onClick={() => this.props.resetAccountSearch()}
                />
              </div>
            </div>
          )}
        </Form>
      </React.Fragment>
    );
  }
  render() {
    return <div>{this.renderForm()}</div>;
  }
}

const mapStateToProps = state => {
  return {
    accountsManagement: state.accountsManagement,
  };
};

export default connect(
  mapStateToProps,
  { resetAccountCreation, searchAccount, resetAccountSearch }
)(SearchAccountForm);
