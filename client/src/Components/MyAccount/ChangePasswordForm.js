import React from "react";
import { Form } from "informed";
import TextInput from "../Elements/TextInput";

const ChangePasswordForm = props => {
  return (
    <Form
      id="changePasswordForm"
      onSubmit={formState => props.changePasswordHandler(formState)}
    >
      <TextInput
        type="password"
        name="currentPassword"
        label="Current Password"
        classes=" form-control mb-1"
        required
      />
      <div className="row">
        <div className="col">
          <TextInput
            type="password"
            name="newPassword"
            label="New Password"
            classes="form-control mb-1"
            required
          />
        </div>
        <div className="col">
          <TextInput
            type="password"
            name="newPassword2"
            label="Confirm Password"
            classes=" form-control mb-1"
            required
          />
        </div>
      </div>
    </Form>
  );
};

export default ChangePasswordForm;
