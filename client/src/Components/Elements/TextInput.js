import React from "react";
import { Text } from "informed";
import PropTypes from "prop-types";

const TextInput = props => {
  return (
    <React.Fragment>
      <label htmlFor={props.name} className="sr-only">
        {props.label}
      </label>
      <Text
        field={props.name}
        id={props.name}
        className={props.classes}
        placeholder={props.label}
        type={props.type}
        required={props.required}
        autoFocus={props.autoFocus}
        readOnly={props.readOnly}
        disabled={props.disabled}
        onChange={props.onChange}
      />
    </React.Fragment>
  );
};

TextInput.propsTypes = {
  required: PropTypes.bool,
  autoFocus: PropTypes.bool,
  readOnly: PropTypes.bool,
  name: PropTypes.string,
  label: PropTypes.string,
}

TextInput.defaultProps = {
  type: "text",
  required: false,
  autoFocus: false,
  readOnly: false,
  classes: "form-control mb-1"
};

export default TextInput;
