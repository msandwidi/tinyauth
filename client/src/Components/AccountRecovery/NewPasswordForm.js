import React from "react";
import { Form } from "informed";
import { NavLink } from "react-router-dom";
import TextInput from "../Elements/TextInput";
import Button from "../Elements/Button";

const NewPasswordForm = props => {
  return (
    <Form
      className="form-styled"
      onSubmit={formState => props.NewPasswordHandler(formState)}
    >
      <React.Fragment>
        <div className="text-center mb-3">
          <h1 className="mb-3 font-weight-normal">New Password</h1>
        </div>

        <TextInput
          name="password"
          label="New Password"
          type="password"
          required
          autoFocus
          classes="form-control form-control-styled mb-1"
        />
        <TextInput
          name="password2"
          label="Re-Enter Password"
          type="password"
          required
          classes="form-control form-control-styled mb-1"
        />

        <Button type="submit" className="btn btn-lg btn-primary btn-block" />

        <div className="mt-3">
          <NavLink to="/login">Cancel</NavLink>
        </div>
      </React.Fragment>
    </Form>
  );
};

export default NewPasswordForm;
