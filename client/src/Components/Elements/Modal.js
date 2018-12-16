import React from "react";
import Button from "../Elements/Button";
import PropTypes from "prop-types";
import classnames from "classnames";

const Modal = props => {
  const { fade, centered, preventClose } = props;
  const modalClasses = `${classnames("modal", { fade })}`;
  const positionClasses = `${classnames("modal-dialog", {
    "modal-dialog-centered": centered
  })}`;
  return (
    <div>
      <div
        className={modalClasses}
        id={props.id}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="modal-title"
        aria-hidden="true"
        data-keyboard={props.dataKeyBoard}
        data-backdrop={props.dataBackdrop}
      >
        <div className={positionClasses} role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modal-title">
                {props.title}
              </h5>
              {preventClose ? null : (
                <Button
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  value={<span aria-hidden="true">&times;</span>}
                />
              )}
            </div>
            <div className="modal-body">{props.children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  dataKeyBoard: PropTypes.bool,
  dataBackdrop: PropTypes.string,
  id: PropTypes.string
};

Modal.defaultProps = {
  dataKeyBoard: false,
  dataBackdrop: "static"
};

export default Modal;
