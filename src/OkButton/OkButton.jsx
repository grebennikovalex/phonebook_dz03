import React from "react";
import cn from "classnames";
import Spinner from "../ui_elements/Spinner/Spinner";
import style from "./OkButton.module.scss";

export default function OkButton({ onClick, disabled, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={cn(style.button, {
        [style.disabled]: loading || disabled,
      })}
    >
      {loading ? (
        <div>
          <Spinner size={18} />
        </div>
      ) : (
        <p>OK</p>
      )}
    </button>
  );
}
