import React from "react";
import SuccsessIcon from "../images/success-icon.svg";
import ErrorIcon from "../images/error-icon.svg";

function InfoTooltip({ isOpen, onClose, status }) {
  return (
    <div className={`modal ${isOpen && "modal_open"}`}>
      <div className="modal__body">
        <form className="form" noValidate>
          <button
            type="button"
            className="modal__close-button"
            onClick={onClose}
          ></button>
          {status === "success" ? (
            <div className="modal__section">
              <img className="modal__icon" src={SuccsessIcon} alt="" />
              <p className="modal__status-message">
                Success! You have been registered.
              </p>
            </div>
          ) : (
            <div className="modal__section">
              <img className="modal__icon" src={ErrorIcon} alt="" />
              <p className="modal__status-message">
                Something went wrong. Please try again.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default InfoTooltip;
