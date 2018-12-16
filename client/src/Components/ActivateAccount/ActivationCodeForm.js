import React from "react";
import { Form } from "informed";
import classnames from "classnames";
import { NavLink } from "react-router-dom";
import TextInput from "../Elements/TextInput";
import Button from "../Elements/Button";

const ActivationCodeForm = props => {
  let isSubmitted = false;
  const submitBtnClasses = `${classnames("btn btn-lg btn-primary btn-block", {
    disabled: isSubmitted
  })}`;
  return (
      <Form
        className="form-styled"
        id="activationCodeForm"
        onSubmit={formState => props.activateAccountHandler(formState)}
      >
        <React.Fragment>
          <div className="text-center mb-3">
            <h1 className="mb-3 font-weight-normal">Activation Code</h1>
          </div>
          <TextInput
            name="code"
            label="Activation Code"
            required
            autoFocus
            classes="form-control form-control-styled mb-1"
          />

          <Button
            type="submit"
            form="activationCodeForm"
            className={submitBtnClasses}
            onClick={() => (isSubmitted = true)}
          />

          <div className="mt-3">
            <NavLink to="/login">Cancel</NavLink>
          </div>
        </React.Fragment>
      </Form>
  );
};

export default ActivationCodeForm;
