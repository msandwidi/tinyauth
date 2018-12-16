import React from "react";
import { Form } from "informed";
import TextInput from "../Elements/TextInput";

const UpdateProfileForm = props => {
  return (
    <Form
      id="updateProfileForm"
      onSubmit={formState => props.updateProfileHandler(formState)}
      initialValues={props.user}
    >
      <div className="row">
        <div className="col">
          <TextInput
            name="firstname"
            label="First Name"
            classes="form-control  mb-1"
            required
          />
        </div>
        <div className="col">
          <TextInput
            name="lastname"
            label="Last Name"
            classes=" form-control  mb-1"
            required
          />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <TextInput
            type="email"
            name="email"
            label="Email Address"
            classes=" form-control mb-1"
            required
          />
        </div>
        <div className="col">
          <TextInput
            name="phoneNumber"
            label="Phone Number"
            classes=" form-control mb-1"
          />
        </div>
      </div>
      <TextInput
        type="password"
        name="password"
        label="Current Password"
        classes=" form-control mt-4"
        required
      />
    </Form>
  );
};

export default UpdateProfileForm;
