import React from "react";
import Button from "../Elements/Button";

const ProfileSection = props => {
  const { user } = props;
  return (
    <div className="mt-3">
      <h5>My Profile</h5>
      <div className="row">
        <div className="col-sm-9">
          <ul className="list-group list-group-flush">
            <li className="list-group-item pl-0">
              <b>Name: </b> {user.firstname} {user.lastname}
            </li>
            <li className="list-group-item pl-0">
              <b>Email Address: </b>
              {user.email}
            </li>
            <li className="list-group-item pl-0">
              <b>Phone #: </b>
              {user.phoneNumber}
            </li>
          </ul>

          <Button
            className="btn btn-primary mr-5 mt-2"
            data-toggle="modal"
            data-target="#updateProfile"
            value="Update Profile"
          />
          <Button
            className="btn btn-primary mt-2"
            data-toggle="modal"
            data-target="#changePassword"
            value="Change Password"
          />
        </div>
      </div>
    </div>
  );
};
export default ProfileSection;
