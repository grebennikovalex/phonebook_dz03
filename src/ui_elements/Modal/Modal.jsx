import React from "react";
import style from "./Modal.module.scss";
import Button from "../Button/Button";

export default function Modal({ open, close, children, action, loading }) {
  if (!open) return null;
  else
    return (
      <>
        <div className={style.backDrop} onClick={close}></div>
        <div
          tabIndex="0"
          className={style.body}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              action();
              close();
            }
          }}
        >
          <button className={style.closeButton} onClick={close}>
            <div style={{ rotate: "45deg" }}>+</div>
          </button>
          <div className={style.content}>{children}</div>
          <div className={style.buttonsContainer}>
            <Button onClick={action} type="primary" text="Ok" loading={loading} />
          </div>
        </div>
      </>
    );
}
