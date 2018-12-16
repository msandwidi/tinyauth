import React from "react";
import PropTypes from "prop-types";

const FileInput = props => {
  return (
    <div className="custom-file">
      <label htmlFor={props.name} className="custom-file-label">
        {props.label}
      </label>
      <input
        name={props.name}
        id={props.name}
        className={props.classes}
        placeholder={props.label}
        type="file"
        required={props.required}
        onChange={props.onChange}
      />
    </div>
  );
};

FileInput.propsTypes = {
  required: PropTypes.bool,
  name: PropTypes.string,
  label: PropTypes.string
};

FileInput.defaultProps = {
  required: false,
  classes: "custom-file-input"
};

export default FileInput;
