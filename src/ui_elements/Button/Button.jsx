import React from "react";
import cn from "classnames";
import Spinner from "../Spinner/Spinner";
import style from "./Button.module.scss";

export default function Button({ onClick = () => {}, type = "primary", disabled = false, loading = false, text }) {
  return (
    <button
      autoFocus
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      disabled={disabled}
      className={cn(style.button, {
        [style.disabled]: disabled,
        [style.secondary]: type === "secondary",
      })}
    >
      {loading ? <Spinner size={24} /> : text}
    </button>
  );
}
