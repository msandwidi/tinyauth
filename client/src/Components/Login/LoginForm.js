import React from "react";
import { Form } from "informed";
import { NavLink } from "react-router-dom";
import TextInput from "../Elements/TextInput";
import Button from "../Elements/Button";

const LoginForm = props => {
  return (
    <Form
      className="form-styled"
      onSubmit={formState => {
        props.loginHandler(formState);
      }}
    >
      <React.Fragment>
        <div className="text-center mb-3">
          <h1 className="mb-3 font-weight-normal">Sign In</h1>
        </div>
        <TextInput
          name="username"
          label="Username"
          required
          autoFocus
          type="text"
          classes="form-control form-control-styled mb-1"
        />
        <TextInput
          name="password"
          label="Password"
          type="password"
          required
          classes="form-control form-control-styled mb-1"
        />
        <Button type="submit" className="btn btn-lg btn-primary btn-block" />

        <div className="row mt-3">
          <div className="col">
            <NavLink to="/recovery" className="float-right">
              Forgot Password?
            </NavLink>
          </div>
        </div>
      </React.Fragment>
    </Form>
  );
};

export default LoginForm;
