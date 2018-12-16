import React from "react";
import PropTypes from "prop-types";

const Button = props => {
  return (
    <React.Fragment>
      <button {...props}>{props.value}</button>
    </React.Fragment>
  );
};

Button.propsTypes = {
  type: PropTypes.string,
  value: PropTypes.string,
  className: PropTypes.string
};

Button.defaultProps = {
  type: "button",
  value: "Submit",
  className: "btn btn-primary"
};

export default Button;
