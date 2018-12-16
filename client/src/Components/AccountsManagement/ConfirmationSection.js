import React from "react";
import Button from "../Elements/Button";

const ConfirmationSection = props => {
  return (
    <div>
      <div>{props.message}</div>
      <Button
        type="submit"
        className="btn btn-success mt-2"
        data-toggle="collapse"
        data-target="#createAccountCollapse"
        aria-expanded="false"
        aria-controls="createAccountCollapse"
        value="Done"
        onClick={props.resetHandler}
      />
    </div>
  );
};
export default ConfirmationSection;
